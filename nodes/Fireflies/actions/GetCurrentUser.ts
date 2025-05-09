import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { callGraphQLApi } from '../transport';
import { getCurrentUserQuery } from '../helpers/queries';
export async function executeGetCurrentUser(this: IExecuteFunctions, i: number, apiKey: string): Promise<INodeExecutionData> {
  const response = await callGraphQLApi(apiKey, getCurrentUserQuery, {});
  return { json: response.user };
}
