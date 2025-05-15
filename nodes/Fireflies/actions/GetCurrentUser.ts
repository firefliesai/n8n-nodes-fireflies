import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { callGraphQLApi } from '../transport';
import { getCurrentUserQuery } from '../helpers/queries';
export async function executeGetCurrentUser(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
  const response = await callGraphQLApi.call(this, getCurrentUserQuery, {});
  return { json: response.user };
}
