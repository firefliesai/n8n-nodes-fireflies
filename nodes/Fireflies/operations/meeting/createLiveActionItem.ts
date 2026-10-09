import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { callGraphQLApi } from '../../transport';
import { createLiveActionItemMutation, handleOperationError } from '../../helpers';

export async function createLiveActionItem(
  ef: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData> {
  try {
    const meetingId = ef.getNodeParameter('meetingId', index) as string;
    const prompt = ef.getNodeParameter('prompt', index) as string;

    const response = await callGraphQLApi.call(ef, createLiveActionItemMutation, {
      input: { meeting_id: meetingId, prompt },
    });

    const result = response.createLiveActionItem;
    return { json: { success: Boolean(result?.success), data: result } };
  } catch (error) {
    return {
      json: handleOperationError(ef.getNode(), error, ef.continueOnFail(), 'createLiveActionItem'),
    };
  }
}
