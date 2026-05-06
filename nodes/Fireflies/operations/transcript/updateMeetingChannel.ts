import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { callGraphQLApi } from '../../transport';
import { updateMeetingChannelMutation, handleOperationError } from '../../helpers';

export async function updateMeetingChannel(ef: IExecuteFunctions, index: number): Promise<INodeExecutionData> {
  try {
    const transcriptIdsRaw = ef.getNodeParameter('transcriptIds', index) as string;
    const channelId = ef.getNodeParameter('channelId', index) as string;

    const transcriptIds = transcriptIdsRaw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (transcriptIds.length === 0) {
      throw new Error('At least one transcript ID is required');
    }
    if (transcriptIds.length > 5) {
      throw new Error('updateMeetingChannel accepts at most 5 transcript IDs per call');
    }

    const response = await callGraphQLApi.call(ef, updateMeetingChannelMutation, {
      input: { transcript_ids: transcriptIds, channel_id: channelId },
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
