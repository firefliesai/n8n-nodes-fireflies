import { INodeProperties } from 'n8n-workflow';

export const askFredFields: INodeProperties[] = [
  // Thread ID field - used by getThread, continueThread, deleteThread
  {
    displayName: 'Thread ID',
    name: 'threadId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['askFred'],
        operation: ['getThread', 'continueThread', 'deleteThread'],
      },
    },
    description: 'ID of the AskFred thread',
  },

  // Query field - used by createThread and continueThread
  {
    displayName: 'Query',
    name: 'query',
    type: 'string',
    required: true,
    default: '',
    typeOptions: {
      rows: 4,
    },
    displayOptions: {
      show: {
        resource: ['askFred'],
        operation: ['createThread', 'continueThread'],
      },
    },
    description: 'The question to ask AskFred (max 2000 characters)',
  },

  // Transcript ID field - optional for createThread
  {
    displayName: 'Transcript ID',
    name: 'transcriptId',
    type: 'string',
    default: '',
    displayOptions: {
      show: {
        resource: ['askFred'],
        operation: ['createThread'],
      },
    },
    description: 'ID of a specific transcript to ask about. If not provided, you can use filters to query across multiple meetings.',
  },

  // Additional fields for createThread
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['askFred'],
        operation: ['createThread'],
      },
    },
    options: [
      {
        displayName: 'Format Mode',
        name: 'formatMode',
        type: 'options',
        default: 'DEFAULT',
        options: [
          {
            name: 'Default',
            value: 'DEFAULT',
            description: 'Standard response format',
          },
          {
            name: 'Toon',
            value: 'TOON',
            description: 'Token-efficient response format',
          },
        ],
        description: 'The format mode for the response',
      },
      {
        displayName: 'Response Language',
        name: 'responseLanguage',
        type: 'string',
        default: '',
        description: 'Language code for the response (e.g., "en", "es", "fr")',
      },
    ],
  },

  // Filters for createThread - to query across multiple meetings
  {
    displayName: 'Meeting Filters',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add Filter',
    default: {},
    displayOptions: {
      show: {
        resource: ['askFred'],
        operation: ['createThread'],
      },
    },
    description: 'Filters to query across multiple meetings (only used when Transcript ID is not provided)',
    options: [
      {
        displayName: 'From Date',
        name: 'fromDate',
        type: 'dateTime',
        default: '',
        description: 'Filter meetings from this date',
      },
      {
        displayName: 'Keyword',
        name: 'keyword',
        type: 'string',
        default: '',
        description: 'Search keyword to filter meetings',
      },
      {
        displayName: 'Limit',
        name: 'limit',
        type: 'number',
        typeOptions: {
          minValue: 1,
        },
        default: 50,
        description: 'Max number of results to return',
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
        displayName: 'Title',
        name: 'title',
        type: 'string',
        default: '',
        description: 'Filter meetings by title',
      },
      {
        displayName: 'To Date',
        name: 'toDate',
        type: 'dateTime',
        default: '',
        description: 'Filter meetings until this date',
      },
    ],
  },

  // Additional fields for continueThread
  {
    displayName: 'Options',
    name: 'options',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['askFred'],
        operation: ['continueThread'],
      },
    },
    options: [
      {
        displayName: 'Format Mode',
        name: 'formatMode',
        type: 'options',
        default: 'DEFAULT',
        options: [
          {
            name: 'Default',
            value: 'DEFAULT',
            description: 'Standard response format',
          },
          {
            name: 'Toon',
            value: 'TOON',
            description: 'Token-efficient response format',
          },
        ],
        description: 'The format mode for the response',
      },
      {
        displayName: 'Response Language',
        name: 'responseLanguage',
        type: 'string',
        default: '',
        description: 'Language code for the response (e.g., "en", "es", "fr")',
      },
    ],
  },

  // Optional transcript filter for getThreads
  {
    displayName: 'Transcript ID',
    name: 'transcriptId',
    type: 'string',
    default: '',
    displayOptions: {
      show: {
        resource: ['askFred'],
        operation: ['getThreads'],
      },
    },
    description: 'Optional: Filter threads by a specific transcript ID',
  },
];
