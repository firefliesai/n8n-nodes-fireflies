import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { callGraphQLApi } from '../../transport';
import { uploadAudioMutation, handleOperationError } from '../../helpers';

export async function uploadAudio(
  ef: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData> {
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
      meeting_date?: string;
      save_video?: boolean;
      webhook?: string;
    };

    const input: Record<string, any> = {
      url,
      title,
    };

    if (additionalFields.attendees?.attendeeValues?.length) {
      input.attendees = additionalFields.attendees.attendeeValues.map((attendee) => ({
        // The API's Attendee input is camelCase (displayName, phoneNumber);
        // snake_case keys are rejected as unknown input fields.
        displayName: attendee.displayName,
        email: attendee.email,
        phoneNumber: attendee.phoneNumber,
      }));
    }

    if (additionalFields.client_reference_id) {
      input.client_reference_id = additionalFields.client_reference_id;
    }

    if (additionalFields.custom_language) {
      input.custom_language = additionalFields.custom_language;
    }

    if (additionalFields.meeting_date) {
      input.meeting_date = new Date(additionalFields.meeting_date).toISOString();
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

      // DownloadAuthType is none | bearer_token | basic_auth; `bearer` and
      // `basic` are the payload keys, not type values.
      if (auth.type === 'bearer_token' && auth.token) {
        downloadAuth = { type: 'bearer_token', bearer: { token: auth.token } };
      } else if (auth.type === 'basic_auth' && auth.password) {
        downloadAuth = {
          type: 'basic_auth',
          basic: { ...(auth.username && { username: auth.username }), password: auth.password },
        };
      } else if (auth.type === 'none') {
        downloadAuth = { type: 'none' };
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
      'uploadAudio',
    );

    return {
      json: errorResponse,
    };
  }
}
