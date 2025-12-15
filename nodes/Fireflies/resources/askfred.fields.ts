import { INodeProperties } from 'n8n-workflow';

export const askfredFields: INodeProperties[] = [
  // Thread ID field for getThread, deleteThread operations
  {
    displayName: 'Thread ID',
    name: 'threadId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['askfred'],
        operation: ['getThread', 'deleteThread', 'continueThread'],
      },
    },
    description: 'The ID of the AskFred thread',
  },

  // Query field for createThread and continueThread operations
  {
    displayName: 'Query',
    name: 'query',
    type: 'string',
    required: true,
    default: '',
    typeOptions: {
      rows: 4,
      maxLength: 2000,
    },
    displayOptions: {
      show: {
        resource: ['askfred'],
        operation: ['createThread', 'continueThread'],
      },
    },
    description: 'The question to ask AskFred (max 2000 characters)',
  },

  // Optional transcript ID filter for getThreads
  {
    displayName: 'Transcript ID',
    name: 'transcriptId',
    type: 'string',
    default: '',
    displayOptions: {
      show: {
        resource: ['askfred'],
        operation: ['getThreads'],
      },
    },
    description: 'Filter threads by a specific transcript/meeting ID',
  },

  // Optional fields for createThread
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['askfred'],
        operation: ['createThread'],
      },
    },
    options: [
      {
        displayName: 'Transcript ID',
        name: 'transcriptId',
        type: 'string',
        default: '',
        description: 'Ask about a specific transcript/meeting',
      },
      {
        displayName: 'Response Language',
        name: 'responseLanguage',
        type: 'string',
        default: '',
        description: 'Language for the response (e.g., "en", "es", "fr")',
      },
      {
        displayName: 'Format Mode',
        name: 'formatMode',
        type: 'options',
        options: [
          {
            name: 'Markdown',
            value: 'markdown',
          },
          {
            name: 'Plain Text',
            value: 'plaintext',
          },
        ],
        default: 'markdown',
        description: 'Output format for the response',
      },
    ],
  },

  // Meeting filters for createThread (when querying across multiple meetings)
  {
    displayName: 'Meeting Filters',
    name: 'meetingFilters',
    type: 'collection',
    placeholder: 'Add Filter',
    default: {},
    displayOptions: {
      show: {
        resource: ['askfred'],
        operation: ['createThread'],
      },
    },
    description: 'Filter meetings when asking questions across multiple meetings',
    options: [
      {
        displayName: 'Channel IDs',
        name: 'channelIds',
        type: 'string',
        default: '',
        description: 'Comma-separated list of channel IDs to filter by',
      },
      {
        displayName: 'End Time',
        name: 'endTime',
        type: 'dateTime',
        default: '',
        description: 'Filter meetings until this date/time (ISO format)',
      },
      {
        displayName: 'Organizers',
        name: 'organizers',
        type: 'string',
        default: '',
        description: 'Comma-separated list of organizer emails to filter by',
      },
      {
        displayName: 'Participants',
        name: 'participants',
        type: 'string',
        default: '',
        description: 'Comma-separated list of participant emails to filter by',
      },
      {
        displayName: 'Start Time',
        name: 'startTime',
        type: 'dateTime',
        default: '',
        description: 'Filter meetings from this date/time (ISO format)',
      },
      {
        displayName: 'Transcript IDs',
        name: 'transcriptIds',
        type: 'string',
        default: '',
        description: 'Comma-separated list of transcript IDs to include',
      },
    ],
  },

  // Optional fields for continueThread
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['askfred'],
        operation: ['continueThread'],
      },
    },
    options: [
      {
        displayName: 'Response Language',
        name: 'responseLanguage',
        type: 'string',
        default: '',
        description: 'Language for the response (e.g., "en", "es", "fr")',
      },
      {
        displayName: 'Format Mode',
        name: 'formatMode',
        type: 'options',
        options: [
          {
            name: 'Markdown',
            value: 'markdown',
          },
          {
            name: 'Plain Text',
            value: 'plaintext',
          },
        ],
        default: 'markdown',
        description: 'Output format for the response',
      },
    ],
  },
];
