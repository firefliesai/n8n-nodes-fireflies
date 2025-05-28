import { IExecuteFunctions, INodeExecutionData, NodeOperationError } from 'n8n-workflow';
import { callGraphQLApi } from '../../transport';
import { getCurrentUserQuery } from '../../helpers/queries';

export async function getCurrentUser(ef: IExecuteFunctions, index: number): Promise<INodeExecutionData> {
  try {
    const response = await callGraphQLApi.call(ef, getCurrentUserQuery, {});

    return {
      json: {
        success: true,
        data: response.user,
      },
    };
  } catch (error) {
    const errorData = {
      success: false,
      error: {
        message: error.message,
        details: 'Error retrieving current user data',
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

    return {
      json: errorData,
    };
  }
}
