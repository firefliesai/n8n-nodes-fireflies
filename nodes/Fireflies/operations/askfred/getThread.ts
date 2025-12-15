import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { callGraphQLApi } from '../../transport';
import { getAskFredThreadQuery, handleOperationError } from '../../helpers';

export async function getThread(ef: IExecuteFunctions, index: number): Promise<INodeExecutionData> {
  try {
    const threadId = ef.getNodeParameter('threadId', index) as string;

    const response = await callGraphQLApi.call(ef, getAskFredThreadQuery, { id: threadId });

    return {
      json: {
        success: true,
        data: response.askfred_thread,
      },
    };
  } catch (error) {
    const errorResponse = handleOperationError(
      ef.getNode(),
      error,
      ef.continueOnFail(),
      'getThread'
    );

    return {
      json: errorResponse,
    };
  }
}
