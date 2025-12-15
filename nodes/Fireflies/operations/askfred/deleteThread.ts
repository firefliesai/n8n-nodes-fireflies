import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { callGraphQLApi } from '../../transport';
import { deleteAskFredThreadMutation, handleOperationError } from '../../helpers';

export async function deleteThread(ef: IExecuteFunctions, index: number): Promise<INodeExecutionData> {
  try {
    const threadId = ef.getNodeParameter('threadId', index) as string;

    const response = await callGraphQLApi.call(ef, deleteAskFredThreadMutation, { id: threadId });

    return {
      json: {
        success: true,
        data: response.deleteAskFredThread,
      },
    };
  } catch (error) {
    const errorResponse = handleOperationError(
      ef.getNode(),
      error,
      ef.continueOnFail(),
      'deleteThread'
    );

    return {
      json: errorResponse,
    };
  }
}
