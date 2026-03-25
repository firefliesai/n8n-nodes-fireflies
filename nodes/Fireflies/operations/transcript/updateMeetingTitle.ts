import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { callGraphQLApi } from '../../transport';
import { updateMeetingTitleMutation, handleOperationError } from '../../helpers';

export async function updateMeetingTitle(ef: IExecuteFunctions, index: number): Promise<INodeExecutionData> {
  try {
    const transcriptId = ef.getNodeParameter('transcriptId', index) as string;
    const title = ef.getNodeParameter('title', index) as string;

    const response = await callGraphQLApi.call(ef, updateMeetingTitleMutation, {
      input: { id: transcriptId, title },
    });

    return {
      json: {
        success: true,
        data: response.updateMeetingTitle,
      },
    };
  } catch (error) {
    const errorResponse = handleOperationError(
      ef.getNode(),
      error,
      ef.continueOnFail(),
      'updateMeetingTitle'
    );

    return {
      json: errorResponse,
    };
  }
}