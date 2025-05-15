import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { callGraphQLApi } from '../transport';
import { getUsersQuery } from '../helpers/queries';

export async function executeGetUsers(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
  const response = await callGraphQLApi.call(this, getUsersQuery, {});

  return response.users.map((user: any) => ({ json: user }));
}