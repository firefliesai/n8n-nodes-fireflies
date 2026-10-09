import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { callGraphQLApi } from '../../transport';
import { getLiveActionItemsQuery, handleOperationError } from '../../helpers';

export async function getLiveActionItems(
  ef: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  try {
    const meetingId = ef.getNodeParameter('meetingId', index) as string;

    const response = await callGraphQLApi.call(ef, getLiveActionItemsQuery, { meetingId });

    return (response.live_action_items ?? []).map((item: Record<string, unknown>) => ({
      json: { success: true, data: item },
    }));
  } catch (error) {
    return [
      {
        json: handleOperationError(ef.getNode(), error, ef.continueOnFail(), 'getLiveActionItems'),
      },
    ];
  }
}
