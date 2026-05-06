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

    const results: Array<{ email: string; success: boolean; message?: string; error?: string }> = [];

    for (const email of emailArray) {
      try {
        const response = await callGraphQLApi.call(ef, revokeSharedMeetingAccessMutation, {
          input: { meeting_id: transcriptId, email },
        });
        const result = response.revokeSharedMeetingAccess;
        results.push({
          email,
          success: Boolean(result?.success),
          message: result?.message,
        });
      } catch (perEmailError) {
        results.push({
          email,
          success: false,
          error: perEmailError instanceof Error ? perEmailError.message : String(perEmailError),
        });
      }
    }

    return {
      json: {
        success: results.every((r) => r.success),
        data: results,
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
