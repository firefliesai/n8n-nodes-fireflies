import { IExecuteFunctions } from 'n8n-workflow';

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

  return response.data;
}
