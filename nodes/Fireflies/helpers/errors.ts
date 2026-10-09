import { NodeOperationError } from 'n8n-workflow';
import type { INode } from 'n8n-workflow';
import {
  FirefliesRateLimitError,
  GraphQLApiError,
  RATE_LIMIT_DOCS_URL,
  RATE_LIMIT_ERROR_CODE,
  getRateLimitInfo,
  toRateLimitNodeApiError,
} from '../transport';

/** Generic error handler for all operations */
export function handleOperationError(
  node: INode,
  error: any,
  continueOnFail: boolean,
  operationName: string,
): any {
  // Rate limited (HTTP 429 / `too_many_requests`) and out of retries.
  // Fails the item with an n8n NodeApiError (httpCode '429') whose message
  // states the wait in seconds; with "Continue On Fail" the item carries it.
  if (error instanceof FirefliesRateLimitError) {
    if (!continueOnFail) {
      throw toRateLimitNodeApiError(node, error);
    }

    return {
      success: false,
      error: {
        message: error.message,
        type: 'Rate Limit Error',
        code: RATE_LIMIT_ERROR_CODE,
        retryAfterSeconds: error.info.retryAfterSeconds,
        retryAt: error.info.retryAt,
        correlationId: error.info.correlationId,
        ...(error.partial && {
          partial: { completed: error.partial.completed, pending: error.partial.pending },
        }),
        details: `Error in ${operationName}. ${
          error.partial ? `${error.partial.summary} ` : ''
        }See ${RATE_LIMIT_DOCS_URL}`,
        timestamp: new Date().toISOString(),
      },
    };
  }

  // Handle GraphQL-specific errors
  if (error instanceof GraphQLApiError) {
    if (!continueOnFail) {
      handleGraphQLErrors(node, error.errors);
    }

    return {
      success: false,
      error: {
        message: error.message,
        type: 'GraphQL Error',
        errors: error.errors.map((err) => ({
          message: err.message,
          code: err.code || err.extensions?.code,
          correlationId: err.extensions?.correlationId,
        })),
        timestamp: new Date().toISOString(),
      },
    };
  }

  // Handle other types of errors (HTTP, network, etc.)
  if (!continueOnFail) {
    throw error;
  }

  return {
    success: false,
    error: {
      message: error.message,
      type: 'System Error',
      details: `Error in ${operationName}`,
      timestamp: new Date().toISOString(),
    },
  };
}

/** Handle GraphQL errors from Fireflies API with minimal abstraction */
export function handleGraphQLErrors(
  node: INode,
  graphqlErrors: Array<{
    message: string;
    code?: string;
    extensions?: {
      code?: string;
      status?: number;
      correlationId?: string;
      metadata?: { retryAfter?: number };
    };
  }>,
): never {
  // A `too_many_requests` entry that reached here without going through the
  // transport's retry (a direct caller) still fails as a 429 with the wait.
  const rateLimit = getRateLimitInfo({ errors: graphqlErrors });
  if (rateLimit) {
    throw toRateLimitNodeApiError(node, new FirefliesRateLimitError(rateLimit));
  }

  // Get the primary error
  const primaryError = graphqlErrors[0];

  // Create a simple, readable error description
  const description = graphqlErrors
    .map(
      (err, index) =>
        `${index + 1}. ${err.message} (code: ${err.code || err.extensions?.code}, correlationId: ${
          err.extensions?.correlationId
        })`,
    )
    .join('\n');

  throw new NodeOperationError(node, primaryError.message, {
    message: primaryError.message,
    description,
  });
}
