import { IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { callGraphQLApi } from '../transport';
import { uploadAudioMutation } from '../helpers/queries';

export async function executeUploadAudio(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
  const url = this.getNodeParameter('url', i) as string;
  const title = this.getNodeParameter('title', i) as string;

  const additionalFields = this.getNodeParameter('additionalFields', i, {}) as {
    attendees?: { attendeeValues: Array<{ displayName: string; email: string; phoneNumber: string }> };
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
    input.attendees = additionalFields.attendees.attendeeValues.map(attendee => ({
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

  const response = await callGraphQLApi.call(this, uploadAudioMutation, { input });

  return { json: response.uploadAudio };
}

export const UploadAudioProperties: INodeProperties[] = [
  {
    displayName: 'URL',
    name: 'url',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        operation: ['uploadAudio'],
      },
    },
    description: 'URL of the audio file to upload',
  },
  {
    displayName: 'Title',
    name: 'title',
    type: 'string',
    default: '',
    displayOptions: {
      show: {
        operation: ['uploadAudio'],
      },
    },
    description: 'Title of the audio file',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        operation: ['uploadAudio'],
      },
    },
    options: [
      {
        displayName: 'Attendees',
        name: 'attendees',
        type: 'fixedCollection',
        typeOptions: {
          multipleValues: true,
        },
        default: {},
        options: [
          {
            name: 'attendeeValues',
            displayName: 'Attendee',
            values: [
              {
                displayName: 'Display Name',
                name: 'displayName',
                type: 'string',
                default: '',
              },
              {
                displayName: 'Email',
                name: 'email',
                type: 'string',
                placeholder: 'example@example.com',
                default: '',
              },
              {
                displayName: 'Phone Number',
                name: 'phoneNumber',
                type: 'string',
                default: '',
              },
            ],
          },
        ],
      },
      {
        displayName: 'Client Reference ID',
        name: 'client_reference_id',
        type: 'string',
        default: '',
        description: 'Custom identifier for the recording',
      },
      {
        displayName: 'Custom Language',
        name: 'custom_language',
        type: 'string',
        default: '',
        description: 'Specify a language for transcription',
      },
      {
        displayName: 'Save Video',
        name: 'save_video',
        type: 'boolean',
        default: false,
        description: 'Whether to save the video file',
      },
      {
        displayName: 'Webhook',
        name: 'webhook',
        type: 'string',
        default: '',
        description: 'URL to receive webhook notifications',
      },
    ],
  },
]