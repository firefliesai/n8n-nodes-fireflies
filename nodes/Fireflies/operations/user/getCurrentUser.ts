import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { callGraphQLApi } from '../../transport';
import { getCurrentUserQuery } from '../../helpers';
import { handleOperationError } from '../../helpers';

export async function getCurrentUser(ef: IExecuteFunctions, index: number): Promise<INodeExecutionData> {
  try {
    const response = await callGraphQLApi.call(ef, getCurrentUserQuery);

    return {
      json: {
        success: true,
        data: response.user,
      },
    };
  } catch (error) {
    const errorResponse = handleOperationError(
      ef.getNode(),
      error,
      ef.continueOnFail(),
      'getCurrentUser'
    );

    return {
      json: errorResponse,
    };
  }
}
