import axios from 'axios';

export async function callGraphQLApi(apiKey: string, query: string, variables: Record<string, any>) {
  const response = await axios.post(
    'http://api.fireflies.ai/graphql',
    {
      query,
      variables,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data;
} 