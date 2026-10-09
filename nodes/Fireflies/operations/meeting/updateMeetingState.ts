import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { callGraphQLApi } from '../../transport';
import { updateMeetingStateMutation, handleOperationError } from '../../helpers';

export async function updateMeetingState(
  ef: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData> {
  try {
    const meetingId = ef.getNodeParameter('meetingId', index) as string;
    const action = ef.getNodeParameter('meetingStateAction', index) as string;

    const response = await callGraphQLApi.call(ef, updateMeetingStateMutation, {
      input: { meeting_id: meetingId, action },
    });

    const result = response.updateMeetingState;
    return { json: { success: Boolean(result?.success), data: result } };
  } catch (error) {
    return {
      json: handleOperationError(ef.getNode(), error, ef.continueOnFail(), 'updateMeetingState'),
    };
  }
}
