import { NodeApiError } from 'n8n-workflow';
import type { IExecuteFunctions, IN8nHttpFullResponse } from 'n8n-workflow';
import { RateLimitedResponseError, getRateLimitInfo, withRateLimitRetry } from './rateLimit';

export * from './rateLimit';

export interface GraphQLError {
  message: string;
  code?: string;
  extensions?: {
    code?: string;
    status?: number;
    correlationId?: string;
    /** `too_many_requests` carries `retryAfter`: an epoch timestamp in milliseconds. */
    metadata?: { retryAfter?: number };
  };
}

export class GraphQLApiError extends Error {
  public readonly errors: GraphQLError[];
  public readonly data?: any;

  constructor(message: string, errors: GraphQLError[], data?: any) {
    super(message);
    this.name = 'GraphQLApiError';
    this.errors = errors;
    this.data = data;
  }
}

interface GraphQLResponseBody {
  data?: any;
  errors?: GraphQLError[];
}

export async function callGraphQLApi(
  this: IExecuteFunctions,
  query: string,
  variables?: Record<string, any>,
) {
  // A rate-limited attempt (HTTP 429, or a `too_many_requests` GraphQL error)
  // is retried after the wait the API asked for, within RATE_LIMIT_RETRY;
  // past that it surfaces as FirefliesRateLimitError. See ./rateLimit.ts.
  return await withRateLimitRetry(async () => {
    // The full response is requested, and a non-2xx status is NOT turned into
    // an error by n8n, because the wait a 429 asks for lives in its
    // `Retry-After` header and n8n's NodeApiError keeps only the body.
    const response = (await this.helpers.httpRequestWithAuthentication.call(this, 'firefliesApi', {
      url: 'https://api.fireflies.ai/graphql',
      method: 'POST',
      body: {
        query,
        ...(variables && { variables }),
      },
      returnFullResponse: true,
      ignoreHttpStatusErrors: true,
    })) as IN8nHttpFullResponse;

    const { statusCode, headers } = response;
    const body = (response.body ?? {}) as GraphQLResponseBody;

    if (getRateLimitInfo({ response: { status: statusCode, headers, data: body } })) {
      throw new RateLimitedResponseError(statusCode, headers, body);
    }

    // Any other failing status: the same NodeApiError n8n's request helper
    // would have thrown (httpCode + a description found in the body), checked
    // BEFORE the body's `errors`, so a 401 or 503 that also carries a GraphQL
    // errors array keeps its HTTP status instead of becoming a GraphQL error.
    if (statusCode >= 400) {
      const errorResponse =
        typeof body === 'object' && body !== null
          ? body
          : { message: response.statusMessage ?? `HTTP ${statusCode}` };
      throw new NodeApiError(this.getNode(), errorResponse as any, {
        httpCode: String(statusCode),
      });
    }

    // Check for GraphQL errors in the response
    if (body.errors && body.errors.length > 0) {
      throw new GraphQLApiError(
        body.errors[0].message || 'GraphQL API error',
        body.errors,
        body.data,
      );
    }

    // Return the data if no errors
    return body.data;
  });
}
