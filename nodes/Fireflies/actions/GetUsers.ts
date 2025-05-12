import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { callGraphQLApi } from '../transport';
import { getUsersQuery } from '../helpers/queries';

export async function executeGetUsers(this: IExecuteFunctions, i: number, apiKey: string): Promise<INodeExecutionData[]> {
  const response = await callGraphQLApi(apiKey, getUsersQuery, {});

  return response.users.map((user: any) => ({ json: user }));
}