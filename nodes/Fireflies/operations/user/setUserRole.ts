import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { callGraphQLApi } from '../../transport';
import { setUserRoleMutation, handleOperationError } from '../../helpers';

export async function setUserRole(ef: IExecuteFunctions, index: number): Promise<INodeExecutionData> {
  try {
    const userId = ef.getNodeParameter('userId', index) as string;
    const role = ef.getNodeParameter('role', index) as string;

    const response = await callGraphQLApi.call(ef, setUserRoleMutation, { userId, role });

    return {
      json: {
        success: true,
        data: response.setUserRole,
      },
    };
  } catch (error) {
    const errorResponse = handleOperationError(
      ef.getNode(),
      error,
      ef.continueOnFail(),
      'setUserRole'
    );

    return {
      json: errorResponse,
    };
  }
}
