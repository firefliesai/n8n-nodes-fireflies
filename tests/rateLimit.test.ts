import { NodeApiError, NodeOperationError } from 'n8n-workflow';
import type { IExecuteFunctions, INode } from 'n8n-workflow';

import {
  FirefliesRateLimitError,
  GraphQLApiError,
  RATE_LIMIT_DOCS_URL,
  RATE_LIMIT_RETRY,
  RateLimitedResponseError,
  callGraphQLApi,
  getRateLimitInfo,
  withRateLimitRetry,
} from '../nodes/Fireflies/transport';
import { handleGraphQLErrors, handleOperationError } from '../nodes/Fireflies/helpers/errors';

const node: INode = {
  id: 'node-1',
  name: 'Fireflies',
  type: '@firefliesai/n8n-nodes-fireflies.fireflies',
  typeVersion: 1,
  position: [0, 0],
  parameters: {},
};

const NOW = Date.parse('2026-10-07T12:00:00.000Z');

/** The body the API sends with a `too_many_requests` error. */
function rateLimitBody(retryAfterMs: number) {
  return {
    errors: [
      {
        message: `Too many requests. Please retry after ${new Date(
          retryAfterMs,
        ).toUTCString()} (UTC)`,
        code: 'too_many_requests',
        extensions: {
          code: 'too_many_requests',
          status: 429,
          correlationId: 'corr-123',
          metadata: { retryAfter: retryAfterMs },
        },
      },
    ],
    data: null,
  };
}

/** An HTTP 429 as the transport sees it: the full response, headers included. */
function http429Error(headers: Record<string, string>, body: unknown = rateLimitBody(NOW + 7_000)) {
  return new RateLimitedResponseError(429, headers, body);
}

/** The full response n8n hands back for `returnFullResponse: true`. */
function fullResponse(statusCode: number, body: unknown, headers: Record<string, string> = {}) {
  return { statusCode, headers, body, statusMessage: statusCode === 200 ? 'OK' : 'Error' };
}

/** A fake execute context whose request helper plays the given responses in order. */
function fakeExecuteFunctions(responses: Array<() => Promise<any>>) {
  const httpRequestWithAuthentication = jest.fn(async () => {
    const next = responses.shift();
    if (!next) throw new Error('no more responses scripted');
    return await next();
  });
  const ef = {
    getNode: () => node,
    helpers: { httpRequestWithAuthentication },
  } as unknown as IExecuteFunctions;
  return { ef, httpRequestWithAuthentication };
}

describe('getRateLimitInfo', () => {
  it('reads Retry-After (seconds) from an HTTP 429', () => {
    const info = getRateLimitInfo(
      http429Error({
        'retry-after': '42',
        'x-ratelimit-limit': '60',
        'x-ratelimit-remaining': '0',
        'x-ratelimit-reset': '42',
      }),
      NOW,
    );

    expect(info).toEqual({
      retryAfterSeconds: 42,
      retryAt: new Date(NOW + 42_000).toISOString(),
      limit: 60,
      remaining: 0,
      correlationId: 'corr-123',
    });
  });

  it('falls back to extensions.metadata.retryAfter, an epoch in milliseconds, when no header is present', () => {
    const body = rateLimitBody(NOW + 90_500);
    const info = getRateLimitInfo(new GraphQLApiError(body.errors[0].message, body.errors), NOW);

    expect(info?.retryAfterSeconds).toBe(91);
    expect(info?.retryAt).toBe(new Date(NOW + 91_000).toISOString());
    expect(info?.correlationId).toBe('corr-123');
  });

  it('never reports less than one second, even for a retryAfter in the past', () => {
    const body = rateLimitBody(NOW - 5_000);
    expect(getRateLimitInfo(new GraphQLApiError('x', body.errors), NOW)?.retryAfterSeconds).toBe(1);
  });

  it('accepts an HTTP-date Retry-After', () => {
    const info = getRateLimitInfo(
      http429Error({ 'Retry-After': new Date(NOW + 10_000).toUTCString() }),
      NOW,
    );
    expect(info?.retryAfterSeconds).toBe(10);
  });

  it('defaults to 60 seconds when a 429 carries no wait at all', () => {
    const info = getRateLimitInfo(http429Error({}, { message: 'Too Many Requests' }), NOW);
    expect(info?.retryAfterSeconds).toBe(60);
  });

  it('still recognises the NodeApiError n8n builds from an axios 429 (body only, no headers)', () => {
    const axiosLike = Object.assign(new Error('Request failed with status code 429'), {
      isAxiosError: true,
      response: { status: 429, headers: { 'retry-after': '99' }, data: rateLimitBody(NOW + 7_000) },
    });
    const wrapped = new NodeApiError(node, axiosLike as any);

    const info = getRateLimitInfo(wrapped, NOW);

    // n8n drops the cause (and its headers); the body's retryAfter still gives the wait.
    expect(wrapped.httpCode).toBe('429');
    expect(info?.retryAfterSeconds).toBe(7);
  });

  it('ignores errors that are not rate limits', () => {
    const forbidden = new GraphQLApiError('Forbidden', [
      { message: 'Forbidden', extensions: { code: 'forbidden', status: 403 } },
    ]);
    expect(getRateLimitInfo(forbidden, NOW)).toBeUndefined();
    expect(getRateLimitInfo(new Error('ECONNRESET'), NOW)).toBeUndefined();
    expect(getRateLimitInfo(undefined, NOW)).toBeUndefined();
  });
});

describe('withRateLimitRetry', () => {
  it('waits the advertised time and retries a burst rejection', async () => {
    const sleepFn = jest.fn(async () => undefined);
    const request = jest
      .fn()
      .mockRejectedValueOnce(http429Error({ 'retry-after': '3' }))
      .mockResolvedValueOnce('ok');

    await expect(withRateLimitRetry(request, { sleepFn, now: () => NOW })).resolves.toBe('ok');

    expect(request).toHaveBeenCalledTimes(2);
    expect(sleepFn).toHaveBeenCalledTimes(1);
    expect(sleepFn).toHaveBeenCalledWith(3_000);
  });

  it('gives up after RATE_LIMIT_RETRY.maxRetries with a FirefliesRateLimitError', async () => {
    const sleepFn = jest.fn(async () => undefined);
    const request = jest.fn().mockRejectedValue(http429Error({ 'retry-after': '2' }));

    await expect(withRateLimitRetry(request, { sleepFn, now: () => NOW })).rejects.toBeInstanceOf(
      FirefliesRateLimitError,
    );

    expect(request).toHaveBeenCalledTimes(RATE_LIMIT_RETRY.maxRetries + 1);
    expect(sleepFn).toHaveBeenCalledTimes(RATE_LIMIT_RETRY.maxRetries);
  });

  it('does not wait for a daily-quota rejection longer than maxWaitMs', async () => {
    const sleepFn = jest.fn(async () => undefined);
    const tooLong = RATE_LIMIT_RETRY.maxWaitMs / 1000 + 1;
    const request = jest.fn().mockRejectedValue(http429Error({ 'retry-after': String(tooLong) }));

    const pending = withRateLimitRetry(request, { sleepFn, now: () => NOW });

    await expect(pending).rejects.toBeInstanceOf(FirefliesRateLimitError);
    await expect(pending).rejects.toMatchObject({ info: { retryAfterSeconds: tooLong } });
    expect(request).toHaveBeenCalledTimes(1);
    expect(sleepFn).not.toHaveBeenCalled();
  });

  it('rethrows anything that is not a rate limit untouched', async () => {
    const sleepFn = jest.fn(async () => undefined);
    const boom = new Error('boom');
    const request = jest.fn().mockRejectedValue(boom);

    await expect(withRateLimitRetry(request, { sleepFn })).rejects.toBe(boom);
    expect(request).toHaveBeenCalledTimes(1);
    expect(sleepFn).not.toHaveBeenCalled();
  });
});

describe('callGraphQLApi', () => {
  it('asks n8n for the full response and not to throw on a failing status', async () => {
    const { ef, httpRequestWithAuthentication } = fakeExecuteFunctions([
      async () => fullResponse(200, { data: { user: { name: 'Sam' } } }),
    ]);

    await callGraphQLApi.call(ef, 'query { user { name } }', { a: 1 });

    expect(httpRequestWithAuthentication).toHaveBeenCalledWith(
      'firefliesApi',
      expect.objectContaining({
        url: 'https://api.fireflies.ai/graphql',
        method: 'POST',
        body: { query: 'query { user { name } }', variables: { a: 1 } },
        returnFullResponse: true,
        ignoreHttpStatusErrors: true,
      }),
    );
  });

  it('retries an HTTP 429 after the Retry-After header, then returns the data', async () => {
    const { ef, httpRequestWithAuthentication } = fakeExecuteFunctions([
      async () => fullResponse(429, rateLimitBody(Date.now() + 60_000), { 'retry-after': '1' }),
      async () => fullResponse(200, { data: { user: { name: 'Sam' } } }),
    ]);

    const started = Date.now();
    await expect(callGraphQLApi.call(ef, 'query { user { name } }')).resolves.toEqual({
      user: { name: 'Sam' },
    });

    expect(httpRequestWithAuthentication).toHaveBeenCalledTimes(2);
    // The header (1 s) won over the body's retryAfter (60 s).
    expect(Date.now() - started).toBeGreaterThanOrEqual(900);
    expect(Date.now() - started).toBeLessThan(5_000);
  }, 10_000);

  it('retries a 200 response whose GraphQL error is too_many_requests', async () => {
    const { ef, httpRequestWithAuthentication } = fakeExecuteFunctions([
      async () => fullResponse(200, rateLimitBody(Date.now() + 1_000)),
      async () => fullResponse(200, { data: { user: { name: 'Sam' } } }),
    ]);

    await expect(callGraphQLApi.call(ef, 'query { user { name } }')).resolves.toEqual({
      user: { name: 'Sam' },
    });
    expect(httpRequestWithAuthentication).toHaveBeenCalledTimes(2);
  }, 10_000);

  it('fails with FirefliesRateLimitError once the retries are spent', async () => {
    const limited = () =>
      fullResponse(429, rateLimitBody(Date.now() + 1_000), { 'retry-after': '1' });
    const { ef, httpRequestWithAuthentication } = fakeExecuteFunctions(
      Array.from({ length: RATE_LIMIT_RETRY.maxRetries + 1 }, () => async () => limited()),
    );

    await expect(callGraphQLApi.call(ef, 'query { user { name } }')).rejects.toBeInstanceOf(
      FirefliesRateLimitError,
    );
    expect(httpRequestWithAuthentication).toHaveBeenCalledTimes(RATE_LIMIT_RETRY.maxRetries + 1);
  }, 15_000);

  it('turns any other failing status into a NodeApiError with that httpCode', async () => {
    const { ef } = fakeExecuteFunctions([
      async () => fullResponse(503, { message: 'upstream unavailable' }),
    ]);

    const error: NodeApiError = await callGraphQLApi
      .call(ef, 'query { user { name } }')
      .catch((e: NodeApiError) => e);

    expect(error).toBeInstanceOf(NodeApiError);
    expect(error.httpCode).toBe('503');
  });

  it('surfaces any other GraphQL error as GraphQLApiError without retrying', async () => {
    const { ef, httpRequestWithAuthentication } = fakeExecuteFunctions([
      async () =>
        fullResponse(200, {
          errors: [{ message: 'Not found', extensions: { code: 'object_not_found', status: 404 } }],
        }),
    ]);

    await expect(
      callGraphQLApi.call(ef, 'query { transcript(id: "x") { id } }'),
    ).rejects.toBeInstanceOf(GraphQLApiError);
    expect(httpRequestWithAuthentication).toHaveBeenCalledTimes(1);
  });
});

describe('handleOperationError on a rate limit', () => {
  const info = getRateLimitInfo(http429Error({ 'retry-after': '25' }), NOW)!;
  const rateLimitError = new FirefliesRateLimitError(info);

  it('throws an n8n NodeApiError with httpCode 429 stating the wait in seconds', () => {
    let thrown: NodeApiError | undefined;
    try {
      handleOperationError(node, rateLimitError, false, 'getTranscript');
    } catch (error) {
      thrown = error;
    }

    expect(thrown).toBeInstanceOf(NodeApiError);
    expect(thrown?.httpCode).toBe('429');
    expect(thrown?.message).toBe('Fireflies API rate limit reached. Retry after 25 seconds.');
    expect(thrown?.description).toContain('Wait 25 seconds');
    expect(thrown?.description).toContain(RATE_LIMIT_DOCS_URL);
    expect(thrown?.description).toContain('corr-123');
    // The epoch-milliseconds timestamp never leaks into what the user reads.
    expect(thrown?.message).not.toMatch(/\d{13}/);
    expect(thrown?.description).not.toMatch(/\d{13}/);
  });

  it('returns an error item carrying retryAfterSeconds when Continue On Fail is on', () => {
    const result = handleOperationError(node, rateLimitError, true, 'getTranscript');

    expect(result.success).toBe(false);
    expect(result.error).toMatchObject({
      type: 'Rate Limit Error',
      code: 'too_many_requests',
      retryAfterSeconds: 25,
      retryAt: new Date(NOW + 25_000).toISOString(),
      correlationId: 'corr-123',
      message: 'Fireflies API rate limit reached. Retry after 25 seconds.',
    });
    expect(result.error.details).toContain(RATE_LIMIT_DOCS_URL);
  });

  it('still maps a too_many_requests GraphQL error handed straight to handleGraphQLErrors', () => {
    const body = rateLimitBody(Date.now() + 12_000);
    let thrown: NodeApiError | undefined;
    try {
      handleGraphQLErrors(node, body.errors);
    } catch (error) {
      thrown = error;
    }

    expect(thrown).toBeInstanceOf(NodeApiError);
    expect(thrown?.httpCode).toBe('429');
    expect(thrown?.message).toMatch(
      /^Fireflies API rate limit reached\. Retry after 1[12] seconds\.$/,
    );
  });

  it('leaves other GraphQL errors on the existing NodeOperationError path', () => {
    const forbidden = new GraphQLApiError('Forbidden', [
      { message: 'Forbidden', extensions: { code: 'forbidden', status: 403 } },
    ]);

    expect(() => handleOperationError(node, forbidden, false, 'getTranscript')).toThrow(
      NodeOperationError,
    );
  });
});
