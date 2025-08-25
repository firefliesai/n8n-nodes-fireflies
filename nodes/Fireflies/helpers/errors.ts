import { NodeOperationError } from 'n8n-workflow';
import type { INode } from 'n8n-workflow';
import { GraphQLApiError } from '../transport';

/** Generic error handler for all operations */
export function handleOperationError(
  node: INode,
  error: any,
  continueOnFail: boolean,
  operationName: string,
): any {
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
        errors: error.errors.map(err => ({
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
    };
  }>,
): never {
  // Get the primary error
  const primaryError = graphqlErrors[0];
  
  // Create a simple, readable error description
  const description = graphqlErrors.map((err, index) => 
    `${index + 1}. ${err.message} (code: ${err.code || err.extensions?.code}, correlationId: ${err.extensions?.correlationId})`
  ).join('\n');

  throw new NodeOperationError(node, primaryError.message, {
    message: primaryError.message,
    description,
  });
}
