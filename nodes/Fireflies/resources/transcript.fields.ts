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
        operation: ['getTranscript', 'getTranscriptAnalytics', 'getTranscriptSummary', 'getTranscriptAudioUrl', 'getTranscriptVideoUrl', 'deleteTranscript', 'updateMeetingTitle', 'updateMeetingPrivacy', 'updateMeetingChannel', 'shareMeeting', 'revokeSharedMeetingAccess'],
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
        displayName: 'Channel ID',
        name: 'channelId',
        type: 'string',
        default: '',
        description: 'Filter by channel ID',
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
        displayName: 'Keyword',
        name: 'keyword',
        type: 'string',
        default: '',
        description: 'Search by keyword',
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
        displayName: 'Organizers',
        name: 'organizers',
        type: 'string',
        default: '',
        description: 'Comma-separated organizer emails',
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
        displayName: 'Participants',
        name: 'participants',
        type: 'string',
        default: '',
        description: 'Comma-separated participant emails',
      },
      {
        displayName: 'Scope',
        name: 'scope',
        type: 'string',
        default: '',
        description: 'Filter scope',
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

  // Title field for updateMeetingTitle
  {
    displayName: 'Title',
    name: 'title',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['transcript'],
        operation: ['updateMeetingTitle'],
      },
    },
    description: 'New title for the meeting',
  },

  // Privacy field for updateMeetingPrivacy
  {
    displayName: 'Privacy',
    name: 'privacy',
    type: 'options',
    required: true,
    options: [
      { name: 'Link', value: 'link' },
      { name: 'Owner', value: 'owner' },
      { name: 'Participants', value: 'participants' },
      { name: 'Teammates', value: 'teammates' },
      { name: 'Teammates and Participants', value: 'teammatesandparticipants' },
    ],
    default: 'participants',
    displayOptions: {
      show: {
        resource: ['transcript'],
        operation: ['updateMeetingPrivacy'],
      },
    },
    description: 'Privacy setting for the meeting',
  },

  // Channel ID field for updateMeetingChannel
  {
    displayName: 'Channel ID',
    name: 'channelId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['transcript'],
        operation: ['updateMeetingChannel'],
      },
    },
    description: 'ID of the channel to move the meeting to',
  },

  // Emails field for shareMeeting and revokeSharedMeetingAccess
  {
    displayName: 'Emails',
    name: 'emails',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['transcript'],
        operation: ['shareMeeting', 'revokeSharedMeetingAccess'],
      },
    },
    description: 'Comma-separated list of email addresses',
  },

  // Additional fields for shareMeeting
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['transcript'],
        operation: ['shareMeeting'],
      },
    },
    options: [
      {
        displayName: 'Expires At',
        name: 'expiresAt',
        type: 'string',
        default: '',
        description: 'Expiry date for the shared access (ISO format)',
      },
    ],
  },
];
