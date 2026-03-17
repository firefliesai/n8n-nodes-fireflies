import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { callGraphQLApi } from '../../transport';
import { shareMeetingMutation, handleOperationError } from '../../helpers';

export async function shareMeeting(ef: IExecuteFunctions, index: number): Promise<INodeExecutionData> {
  try {
    const transcriptId = ef.getNodeParameter('transcriptId', index) as string;
    const emails = ef.getNodeParameter('emails', index) as string;
    const additionalFields = ef.getNodeParameter('additionalFields', index, {}) as {
      expiresAt?: string;
    };

    const emailArray = emails.split(',').map((e) => e.trim()).filter(Boolean);

    const input: Record<string, any> = {
      id: transcriptId,
      emails: emailArray,
    };

    if (additionalFields.expiresAt) {
      input.expires_at = additionalFields.expiresAt;
    }

    const response = await callGraphQLApi.call(ef, shareMeetingMutation, { input });

    return {
      json: {
        success: true,
        data: response.shareMeeting,
      },
    };
  } catch (error) {
    const errorResponse = handleOperationError(
      ef.getNode(),
      error,
      ef.continueOnFail(),
      'shareMeeting'
    );

    return {
      json: errorResponse,
    };
  }
}