import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { callGraphQLApi } from '../../transport';
import { updateMeetingChannelMutation, handleOperationError } from '../../helpers';

export async function updateMeetingChannel(ef: IExecuteFunctions, index: number): Promise<INodeExecutionData> {
  try {
    const transcriptId = ef.getNodeParameter('transcriptId', index) as string;
    const channelId = ef.getNodeParameter('channelId', index) as string;

    const response = await callGraphQLApi.call(ef, updateMeetingChannelMutation, {
      input: { id: transcriptId, channel_id: channelId },
    });

    return {
      json: {
        success: true,
        data: response.updateMeetingChannel,
      },
    };
  } catch (error) {
    const errorResponse = handleOperationError(
      ef.getNode(),
      error,
      ef.continueOnFail(),
      'updateMeetingChannel'
    );

    return {
      json: errorResponse,
    };
  }
}