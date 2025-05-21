import { IExecuteFunctions, INodeExecutionData, NodeOperationError } from 'n8n-workflow';
import { callGraphQLApi } from '../../transport';
import { uploadAudioMutation } from '../../helpers/queries';

export async function uploadAudio(ef: IExecuteFunctions): Promise<INodeExecutionData> {
  try {
    const url = ef.getNodeParameter('url', 0) as string;
    const title = ef.getNodeParameter('title', 0) as string;

    const additionalFields = ef.getNodeParameter('additionalFields', 0, {}) as {
      attendees?: {
        attendeeValues: Array<{ displayName: string; email: string; phoneNumber: string }>;
      };
      client_reference_id?: string;
      custom_language?: string;
      save_video?: boolean;
      webhook?: string;
    };

    const input: Record<string, any> = {
      url,
      title,
    };

    if (additionalFields.attendees?.attendeeValues?.length) {
      input.attendees = additionalFields.attendees.attendeeValues.map((attendee) => ({
        display_name: attendee.displayName,
        email: attendee.email,
        phone_number: attendee.phoneNumber,
      }));
    }

    if (additionalFields.client_reference_id) {
      input.client_reference_id = additionalFields.client_reference_id;
    }

    if (additionalFields.custom_language) {
      input.custom_language = additionalFields.custom_language;
    }

    if (additionalFields.save_video !== undefined) {
      input.save_video = additionalFields.save_video;
    }

    if (additionalFields.webhook) {
      input.webhook = additionalFields.webhook;
    }

    const response = await callGraphQLApi.call(ef, uploadAudioMutation, { input });

    return {
      json: {
        success: true,
        data: response.uploadAudio,
      },
    };
  } catch (error) {
    const errorData = {
      success: false,
      error: {
        message: error.message,
        details: 'Error uploading audio',
        code: error.code || 'UNKNOWN_ERROR',
        timestamp: new Date().toISOString(),
      },
    };

    if (!ef.continueOnFail()) {
      throw new NodeOperationError(ef.getNode(), error.message, {
        message: errorData.error.message,
        description: errorData.error.details,
      });
    }

    return {
      json: errorData,
    };
  }
}
