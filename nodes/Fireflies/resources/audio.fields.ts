import { INodeProperties } from 'n8n-workflow';

export const audioFields: INodeProperties[] = [
  {
    displayName: 'URL',
    name: 'url',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['audio'],
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
        resource: ['audio'],
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
        resource: ['audio'],
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
        displayName: 'Bypass Size Check',
        name: 'bypass_size_check',
        type: 'boolean',
        default: false,
        description: 'Whether to bypass the file size check',
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
        displayName: 'Download Auth',
        name: 'download_auth',
        type: 'fixedCollection',
        default: {},
        description: 'Authentication credentials for downloading the audio file',
        options: [
          {
            name: 'authValues',
            displayName: 'Auth',
            values: [
              {
                displayName: 'Type',
                name: 'type',
                type: 'options',
                options: [
                  { name: 'Bearer Token', value: 'bearer_token' },
                  { name: 'Basic Auth', value: 'basic_auth' },
                  { name: 'None', value: 'none' },
                ],
                default: 'bearer_token',
                description: 'Authentication type',
              },
              {
                displayName: 'Token',
                name: 'token',
                type: 'string',
                typeOptions: { password: true },
                default: '',
                description: 'Bearer token (used when type is Bearer Token)',
              },
              {
                displayName: 'Username',
                name: 'username',
                type: 'string',
                default: '',
                description: 'Username (optional, used when type is Basic Auth)',
              },
              {
                displayName: 'Password',
                name: 'password',
                type: 'string',
                typeOptions: { password: true },
                default: '',
                description: 'Password (used when type is Basic Auth)',
              },
            ],
          },
        ],
      },
      {
        displayName: 'Meeting Date',
        name: 'meeting_date',
        type: 'dateTime',
        default: '',
        description:
          'When the meeting took place (cannot be in the future). Defaults to the upload time.',
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
  {
    displayName: 'Input Binary Field',
    name: 'binaryPropertyName',
    type: 'string',
    required: true,
    default: 'data',
    displayOptions: {
      show: {
        resource: ['audio'],
        operation: ['uploadFile'],
      },
    },
    description: 'Name of the input binary field holding the audio or video file',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['audio'],
        operation: ['uploadFile'],
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
        displayName: 'Content Type',
        name: 'content_type',
        type: 'string',
        default: '',
        placeholder: 'audio/mpeg',
        description: "MIME type of the file. Defaults to the binary field's MIME type.",
      },
      {
        displayName: 'Custom Language',
        name: 'custom_language',
        type: 'string',
        default: '',
        description: 'Language code of the meeting, e.g. es or de (max 5 characters)',
      },
      {
        displayName: 'Title',
        name: 'title',
        type: 'string',
        default: '',
        description: 'Title of the meeting. Defaults to the file name.',
      },
    ],
  },
];
