import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { callGraphQLApi } from '../../transport';
import { uploadAudioMutation, handleOperationError } from '../../helpers';

export async function uploadAudio(ef: IExecuteFunctions, index: number): Promise<INodeExecutionData> {
  try {
    const url = ef.getNodeParameter('url', index) as string;
    const title = ef.getNodeParameter('title', index) as string;

    const additionalFields = ef.getNodeParameter('additionalFields', index, {}) as {
      attendees?: {
        attendeeValues: Array<{ displayName: string; email: string; phoneNumber: string }>;
      };
      bypass_size_check?: boolean;
      client_reference_id?: string;
      custom_language?: string;
      download_auth?: {
        authValues?: { type: string; token?: string; username?: string; password?: string };
      };
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

    if (additionalFields.bypass_size_check !== undefined) {
      input.bypass_size_check = additionalFields.bypass_size_check;
    }

    if (additionalFields.download_auth?.authValues) {
      const auth = additionalFields.download_auth.authValues;
      let downloadAuth: Record<string, any> | undefined;

      if (auth.type === 'bearer' && auth.token) {
        downloadAuth = { type: 'bearer', bearer: { token: auth.token } };
      } else if (auth.type === 'basic' && auth.username && auth.password) {
        downloadAuth = {
          type: 'basic',
          basic: { username: auth.username, password: auth.password },
        };
      }

      if (downloadAuth) {
        input.download_auth = downloadAuth;
      }
    }

    const response = await callGraphQLApi.call(ef, uploadAudioMutation, { input });

    return {
      json: {
        success: true,
        data: response.uploadAudio,
      },
    };
  } catch (error) {
    const errorResponse = handleOperationError(
      ef.getNode(),
      error,
      ef.continueOnFail(),
      'uploadAudio'
    );

    return {
      json: errorResponse,
    };
  }
}
