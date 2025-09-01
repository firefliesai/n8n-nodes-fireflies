import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { callGraphQLApi } from '../../transport';
import { getUsersQuery } from '../../helpers';
import { handleOperationError } from '../../helpers';

export async function getUsers(ef: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
  try {
    const response = await callGraphQLApi.call(ef, getUsersQuery, {});

    return response.users.map((user: any) => ({
      json: {
        success: true,
        data: user,
      },
    }));
  } catch (error) {
    const errorResponse = handleOperationError(
      ef.getNode(),
      error,
      ef.continueOnFail(),
      'getUsers'
    );

    return [{ json: errorResponse }];
  }
}
