import { NodeApiError, sleep } from 'n8n-workflow';
import type { INode, JsonValue } from 'n8n-workflow';

/** Public documentation of the per-plan limits. Linked, never copied: the numbers change. */
export const RATE_LIMIT_DOCS_URL = 'https://docs.fireflies.ai/fundamentals/limits';

/** `extensions.code` the Fireflies GraphQL API uses when a request is rate limited. */
export const RATE_LIMIT_ERROR_CODE = 'too_many_requests';

/**
 * Retry policy for a rate-limited request.
 *
 * A per-minute (burst) rejection clears within seconds, so the node waits and
 * retries a couple of times instead of failing the workflow. A daily-quota
 * rejection asks for minutes or hours; blocking the n8n worker that long is
 * never right, so anything above `maxWaitMs` is thrown immediately with the
 * wait stated in the message.
 */
export const RATE_LIMIT_RETRY = {
  maxRetries: 2,
  maxWaitMs: 30_000,
} as const;

/** Wait assumed when the API says "too many requests" but gives no usable wait. */
const DEFAULT_RETRY_AFTER_SECONDS = 60;

export type Headers = Record<string, unknown>;

export interface RateLimitInfo {
  /** Seconds the API asked us to wait (always >= 1). */
  retryAfterSeconds: number;
  /** ISO timestamp of the moment the request can be retried. */
  retryAt: string;
  /** Window size, from `X-RateLimit-Limit`, when the response carried it. */
  limit?: number;
  /** Requests left in the window, from `X-RateLimit-Remaining`, when present. */
  remaining?: number;
  correlationId?: string;
}

/**
 * A `429` (or a `too_many_requests` body) the transport received with
 * `ignoreHttpStatusErrors`, thrown so `withRateLimitRetry` sees it. It carries
 * the full response under `response`, the same shape an axios error uses, so
 * `getRateLimitInfo` reads both with one code path. n8n's own `NodeApiError`
 * cannot serve here: it drops an `Error` cause, and the `Retry-After` header
 * with it.
 */
export class RateLimitedResponseError extends Error {
  public readonly response: { status: number; headers: Headers; data: unknown };

  constructor(status: number, headers: Headers, data: unknown) {
    super(`Fireflies API answered ${status}`);
    this.name = 'RateLimitedResponseError';
    this.response = { status, headers, data };
  }
}

/**
 * Thrown by the transport once a rate-limited request is out of retries (or
 * was never worth retrying). `handleOperationError` turns it into an n8n
 * `NodeApiError` (`httpCode: '429'`) or, with "Continue On Fail", into a JSON
 * error item that carries `retryAfterSeconds`.
 */
export class FirefliesRateLimitError extends Error {
  public readonly info: RateLimitInfo;
  public readonly cause?: unknown;
  /**
   * Progress an operation had made before the limit hit, when it issues
   * several requests per item (one per e-mail address, say). Set with
   * `withPartialProgress`; surfaced on the error item and in the description
   * so a workflow can tell what already took effect and what was never tried.
   */
  public readonly partial?: RateLimitPartialProgress;

  constructor(info: RateLimitInfo, cause?: unknown, partial?: RateLimitPartialProgress) {
    super(formatRateLimitMessage(info));
    this.name = 'FirefliesRateLimitError';
    this.info = info;
    this.cause = cause;
    this.partial = partial;
  }

  /** The same error, annotated with what the operation had completed and what is still pending. */
  withPartialProgress(partial: RateLimitPartialProgress): FirefliesRateLimitError {
    return new FirefliesRateLimitError(this.info, this.cause, partial);
  }
}

export interface RateLimitPartialProgress {
  /** Outcomes of the requests that ran before the limit hit, in the operation's own shape. */
  completed: JsonValue[];
  /** The inputs that were never attempted. */
  pending: JsonValue[];
  /** One human-readable sentence, appended to the error description. */
  summary: string;
}

export function formatRateLimitMessage(info: Pick<RateLimitInfo, 'retryAfterSeconds'>): string {
  return `Fireflies API rate limit reached. Retry after ${info.retryAfterSeconds} seconds.`;
}

export function formatRateLimitDescription(
  info: RateLimitInfo,
  partial?: RateLimitPartialProgress,
): string {
  const parts = [
    `The Fireflies API rejected this request because your plan's request limit was reached (${RATE_LIMIT_ERROR_CODE}).`,
    `Wait ${info.retryAfterSeconds} seconds (until ${info.retryAt}) before retrying; retrying earlier extends the block.`,
    'To retry automatically, enable "Retry On Fail" in the node settings with a wait of at least that long.',
    `Limits per plan: ${RATE_LIMIT_DOCS_URL}`,
  ];
  if (partial) parts.push(partial.summary);
  if (info.correlationId) parts.push(`Correlation ID: ${info.correlationId}`);
  return parts.join(' ');
}

/** Build the n8n error a rate-limited item fails with. */
export function toRateLimitNodeApiError(
  node: INode,
  error: FirefliesRateLimitError,
  itemIndex?: number,
): NodeApiError {
  return new NodeApiError(
    node,
    {
      message: error.message,
      code: RATE_LIMIT_ERROR_CODE,
      retryAfterSeconds: error.info.retryAfterSeconds,
      retryAt: error.info.retryAt,
      correlationId: error.info.correlationId ?? null,
      ...(error.partial && {
        partial: { completed: error.partial.completed, pending: error.partial.pending },
      }),
    },
    {
      httpCode: '429',
      message: error.message,
      description: formatRateLimitDescription(error.info, error.partial),
      itemIndex,
    },
  );
}

/** The shape of one entry of a GraphQL `errors` array, as far as rate limiting cares. */
interface GraphQLErrorLike {
  message?: string;
  code?: string;
  extensions?: {
    code?: string;
    status?: number;
    correlationId?: string;
    metadata?: { retryAfter?: number };
  };
}

function isObject(value: unknown): value is Record<string, any> {
  return typeof value === 'object' && value !== null;
}

/** First rate-limit entry in a GraphQL `errors` array, or undefined. */
function findRateLimitGraphQLError(errors: unknown): GraphQLErrorLike | undefined {
  if (!Array.isArray(errors)) return undefined;
  return errors.find(
    (err): err is GraphQLErrorLike =>
      isObject(err) &&
      (err.extensions?.code === RATE_LIMIT_ERROR_CODE || err.code === RATE_LIMIT_ERROR_CODE),
  );
}

/**
 * The HTTP response an error was built from, if any. Covers an axios error
 * (`error.response`), the `NodeApiError` n8n's request helper wraps it in
 * (`error.cause.response`, `error.context.data`) and a plain `{ statusCode }`.
 */
function extractHttpResponse(error: any): { status?: number; headers?: Headers; data?: any } {
  const response = error?.response ?? error?.cause?.response;
  if (isObject(response)) {
    return {
      status: Number(response.status ?? response.statusCode) || undefined,
      headers: isObject(response.headers) ? response.headers : undefined,
      data: response.data ?? response.body,
    };
  }
  const status = Number(error?.httpCode ?? error?.statusCode ?? error?.status) || undefined;
  return { status, headers: undefined, data: error?.context?.data ?? error?.body };
}

function readHeader(headers: Headers | undefined, name: string): string | undefined {
  if (!headers) return undefined;
  const key = Object.keys(headers).find((k) => k.toLowerCase() === name.toLowerCase());
  if (key === undefined) return undefined;
  const value = headers[key];
  const first = Array.isArray(value) ? value[0] : value;
  return first === undefined || first === null ? undefined : String(first);
}

/** `Retry-After` is either delay-seconds or an HTTP-date (RFC 9110 §10.2.3). */
function parseRetryAfterHeader(value: string | undefined, now: number): number | undefined {
  if (value === undefined) return undefined;
  const trimmed = value.trim();
  if (/^\d+$/.test(trimmed)) return Number(trimmed) * 1000;
  const date = Date.parse(trimmed);
  return Number.isNaN(date) ? undefined : date - now;
}

function parseNumberHeader(value: string | undefined): number | undefined {
  if (value === undefined) return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}

/**
 * Describe a rate-limited request, or return undefined when `error` is not one.
 *
 * Recognises both ways the API can report it: an HTTP `429` (the status of the
 * response, read from a `RateLimitedResponseError`, an axios error, or the
 * `httpCode` of a `NodeApiError` n8n built from one) and a GraphQL `errors`
 * entry whose `extensions.code` is `too_many_requests` (the body, whatever the
 * HTTP status). The wait comes from, in order: the `Retry-After` header (seconds),
 * `extensions.metadata.retryAfter` (an epoch timestamp in MILLISECONDS, hence
 * the subtraction), `X-RateLimit-Reset` (seconds), then a 60-second default.
 */
export function getRateLimitInfo(
  error: unknown,
  now: number = Date.now(),
): RateLimitInfo | undefined {
  if (!isObject(error)) return undefined;

  const http = extractHttpResponse(error);
  const graphqlError =
    findRateLimitGraphQLError(error.errors) ?? findRateLimitGraphQLError(http.data?.errors);

  if (http.status !== 429 && !graphqlError) return undefined;

  const retryAfterTimestamp = graphqlError?.extensions?.metadata?.retryAfter;
  const waitMs =
    parseRetryAfterHeader(readHeader(http.headers, 'retry-after'), now) ??
    (typeof retryAfterTimestamp === 'number' ? retryAfterTimestamp - now : undefined) ??
    (() => {
      const reset = parseNumberHeader(readHeader(http.headers, 'x-ratelimit-reset'));
      return reset === undefined ? undefined : reset * 1000;
    })() ??
    DEFAULT_RETRY_AFTER_SECONDS * 1000;

  const retryAfterSeconds = Math.max(1, Math.ceil(waitMs / 1000));

  return {
    retryAfterSeconds,
    retryAt: new Date(now + retryAfterSeconds * 1000).toISOString(),
    limit: parseNumberHeader(readHeader(http.headers, 'x-ratelimit-limit')),
    remaining: parseNumberHeader(readHeader(http.headers, 'x-ratelimit-remaining')),
    correlationId: graphqlError?.extensions?.correlationId,
  };
}

export interface RateLimitRetryOptions {
  maxRetries?: number;
  maxWaitMs?: number;
  /** Injectable for tests. */
  sleepFn?: (ms: number) => Promise<void>;
  now?: () => number;
}

/**
 * Run `request`, retrying a rate-limited attempt after the wait the API asked
 * for, within `RATE_LIMIT_RETRY`. Any other failure is rethrown untouched. Once
 * the policy is exhausted, or the wait is too long to sit through, the attempt
 * fails with `FirefliesRateLimitError`.
 */
export async function withRateLimitRetry<T>(
  request: () => Promise<T>,
  options: RateLimitRetryOptions = {},
): Promise<T> {
  const maxRetries = options.maxRetries ?? RATE_LIMIT_RETRY.maxRetries;
  const maxWaitMs = options.maxWaitMs ?? RATE_LIMIT_RETRY.maxWaitMs;
  const sleepFn = options.sleepFn ?? sleep;
  const now = options.now ?? Date.now;

  for (let attempt = 0; ; attempt++) {
    try {
      return await request();
    } catch (error) {
      const info = getRateLimitInfo(error, now());
      if (!info) throw error;

      const waitMs = info.retryAfterSeconds * 1000;
      if (attempt >= maxRetries || waitMs > maxWaitMs) {
        throw new FirefliesRateLimitError(info, error);
      }
      await sleepFn(waitMs);
    }
  }
}
