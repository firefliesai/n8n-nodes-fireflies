import { IExecuteFunctions, INodeExecutionData, NodeOperationError } from 'n8n-workflow';
import { callGraphQLApi } from '../../transport';
import { getUsersQuery } from '../../helpers/queries';

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
    const errorData = {
      success: false,
      error: {
        message: error.message,
        details: 'Error retrieving users data',
        code: error.code || 'UNKNOWN_ERROR',
        timestamp: new Date().toISOString(),
      },
    };

    if (!ef.continueOnFail()) {
      throw new NodeOperationError(ef.getNode(), error.message, {
        message: errorData.error.message,
        description: errorData.error.details,
      });
    }

    return [{ json: errorData }];
  }
}
