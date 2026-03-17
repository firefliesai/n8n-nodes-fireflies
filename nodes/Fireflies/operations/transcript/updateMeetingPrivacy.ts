import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { callGraphQLApi } from '../../transport';
import { updateMeetingPrivacyMutation, handleOperationError } from '../../helpers';

export async function updateMeetingPrivacy(ef: IExecuteFunctions, index: number): Promise<INodeExecutionData> {
  try {
    const transcriptId = ef.getNodeParameter('transcriptId', index) as string;
    const privacy = ef.getNodeParameter('privacy', index) as string;

    const response = await callGraphQLApi.call(ef, updateMeetingPrivacyMutation, {
      input: { id: transcriptId, privacy },
    });

    return {
      json: {
        success: true,
        data: response.updateMeetingPrivacy,
      },
    };
  } catch (error) {
    const errorResponse = handleOperationError(
      ef.getNode(),
      error,
      ef.continueOnFail(),
      'updateMeetingPrivacy'
    );

    return {
      json: errorResponse,
    };
  }
}