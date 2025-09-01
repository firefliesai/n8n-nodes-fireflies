import { IExecuteFunctions } from 'n8n-workflow';

export interface GraphQLError {
  message: string;
  code?: string;
  extensions?: {
    code?: string;
    status?: number;
    correlationId?: string;
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

export async function callGraphQLApi(
  this: IExecuteFunctions,
  query: string,
  variables?: Record<string, any>,
) {
  const response = await this.helpers.httpRequestWithAuthentication.call(this, 'firefliesApi', {
    url: 'https://api.fireflies.ai/graphql',
    method: 'POST',
    body: {
      query,
      ...(variables && { variables }),
    },
  });

  // Check for GraphQL errors in the response
  if (response.errors && response.errors.length > 0) {
    throw new GraphQLApiError(
      response.errors[0].message || 'GraphQL API error',
      response.errors,
      response.data
    );
  }

  // Return the data if no errors
  return response.data;
}
