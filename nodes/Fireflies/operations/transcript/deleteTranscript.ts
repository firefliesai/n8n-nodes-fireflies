import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { callGraphQLApi } from '../../transport';
import { deleteTranscriptMutation } from '../../helpers';
import { handleOperationError } from '../../helpers';

export async function deleteTranscript(ef: IExecuteFunctions, index: number): Promise<INodeExecutionData> {
  try {
    const id = ef.getNodeParameter('transcriptId', index) as string;

    const response = await callGraphQLApi.call(ef, deleteTranscriptMutation, { id });

    return {
      json: {
        success: true,
        data: response.deleteTranscript,
      },
    };
  } catch (error) {
    const errorResponse = handleOperationError(
      ef.getNode(),
      error,
      ef.continueOnFail(),
      'deleteTranscript'
    );

    return {
      json: errorResponse,
    };
  }
}