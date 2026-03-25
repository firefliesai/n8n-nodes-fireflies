import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { callGraphQLApi } from '../../transport';
import { revokeSharedMeetingAccessMutation, handleOperationError } from '../../helpers';

export async function revokeSharedMeetingAccess(ef: IExecuteFunctions, index: number): Promise<INodeExecutionData> {
  try {
    const transcriptId = ef.getNodeParameter('transcriptId', index) as string;
    const emails = ef.getNodeParameter('emails', index) as string;

    const emailArray = emails.split(',').map((e) => e.trim()).filter(Boolean);
    if (emailArray.length === 0) {
      throw new Error('At least one valid email address is required');
    }

    const response = await callGraphQLApi.call(ef, revokeSharedMeetingAccessMutation, {
      input: { id: transcriptId, emails: emailArray },
    });

    const result = response.revokeSharedMeetingAccess;
    return {
      json: {
        success: Boolean(result?.success),
        data: result,
      },
    };
  } catch (error) {
    const errorResponse = handleOperationError(
      ef.getNode(),
      error,
      ef.continueOnFail(),
      'revokeSharedMeetingAccess'
    );

    return {
      json: errorResponse,
    };
  }
}