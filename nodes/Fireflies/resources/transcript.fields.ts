import { INodeProperties } from 'n8n-workflow';

export const transcriptFields: INodeProperties[] = [
  // Common fields for all transcript operations

  // Fields for specific transcript operations
  {
    displayName: 'Transcript ID',
    name: 'transcriptId',
    type: 'string',
    default: '',
    displayOptions: {
      show: {
        resource: ['transcript'],
        operation: ['getTranscript', 'getTranscriptAnalytics', 'getTranscriptSummary', 'getTranscriptAudioUrl', 'getTranscriptVideoUrl'],
      },
    },
    description: 'ID of the transcript to operate on',
  },

  // GetTranscriptsList operation fields
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    typeOptions: {
      minValue: 1,
    },
    default: 50,
    description: 'Max number of results to return',
    displayOptions: {
      show: {
        resource: ['transcript'],
        operation: ['getTranscriptsList'],
      },
    },
  },
  {
    displayName: 'Skip',
    name: 'skip',
    type: 'number',
    default: 0,
    description: 'Offset for pagination',
    displayOptions: {
      show: {
        resource: ['transcript'],
        operation: ['getTranscriptsList'],
      },
    },
  },
  {
    displayName: 'Filters',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add Filter',
    default: {},
    displayOptions: {
      show: {
        resource: ['transcript'],
        operation: ['getTranscriptsList'],
      },
    },
    options: [
      {
        displayName: 'Date',
        name: 'date',
        type: 'number',
        typeOptions: {
          minValue: 0,
        },
        default: undefined,
        description: 'Filter by timestamp',
      },
      {
        displayName: 'From Date',
        name: 'fromDate',
        type: 'string',
        default: '',
        description: 'Start date (ISO format)',
      },
      {
        displayName: 'Host Email',
        name: 'hostEmail',
        type: 'string',
        default: '',
        description: 'Filter by host email (deprecated)',
      },
      {
        displayName: 'Mine',
        name: 'mine',
        type: 'boolean',
        default: false,
      },
      {
        displayName: 'Organizer Email',
        name: 'organizerEmail',
        type: 'string',
        default: '',
      },
      {
        displayName: 'Participant Email',
        name: 'participantEmail',
        type: 'string',
        default: '',
      },
      {
        displayName: 'Title',
        name: 'title',
        type: 'string',
        default: '',
        description: 'Filter transcripts by title',
      },
      {
        displayName: 'To Date',
        name: 'toDate',
        type: 'string',
        default: '',
        description: 'End date (ISO format)',
      },
      {
        displayName: 'User ID',
        name: 'userId',
        type: 'string',
        default: '',
      },
    ],
  },
];
