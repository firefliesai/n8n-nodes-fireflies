import { IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import axios from 'axios';

export async function executeUploadAudio(this: IExecuteFunctions, i: number, apiKey: string): Promise<INodeExecutionData> {
  const url = this.getNodeParameter('url', i) as string;
  const title = this.getNodeParameter('title', i) as string;

  const response = await axios.post(
    'https://api.fireflies.ai/graphql',
    {
      query: `
        mutation UploadAudio($input: AudioUploadInput) {
          uploadAudio(input: $input) {
            success
            title
            message
          }
        }
      `,
      variables: {
        input: { url, title },
      },
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return { json: response.data.data.uploadAudio };
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