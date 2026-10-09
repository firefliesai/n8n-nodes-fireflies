import { INodeProperties } from 'n8n-workflow';

const activeMeetingFilters: INodeProperties = {
  displayName: 'Filters',
  name: 'filters',
  type: 'collection',
  placeholder: 'Add Filter',
  default: {},
  displayOptions: {
    show: {
      resource: ['meeting'],
      operation: ['getActiveMeetings'],
    },
  },
  options: [
    {
      displayName: 'Email',
      name: 'email',
      type: 'string',
      placeholder: 'name@email.com',
      default: '',
      description: "Only this teammate's active meetings (admins only)",
    },
    {
      displayName: 'States',
      name: 'states',
      type: 'multiOptions',
      options: [
        { name: 'Active', value: 'active' },
        { name: 'Paused', value: 'paused' },
      ],
      default: [],
      description: 'Meeting states to return. Both by default.',
    },
  ],
};

const liveMeetingOperations = [
  'updateMeetingState',
  'createLiveActionItem',
  'createLiveSoundbite',
  'getLiveActionItems',
];

export const meetingFields: INodeProperties[] = [
  activeMeetingFilters,
  {
    displayName: 'Meeting ID',
    name: 'meetingId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['meeting'],
        operation: liveMeetingOperations,
      },
    },
    description: 'ID of the live meeting (from Meeting → Get Active Meetings)',
  },
  {
    displayName: 'Action',
    name: 'meetingStateAction',
    type: 'options',
    required: true,
    options: [
      { name: 'Pause Recording', value: 'pause_recording' },
      { name: 'Resume Recording', value: 'resume_recording' },
    ],
    default: 'pause_recording',
    displayOptions: {
      show: {
        resource: ['meeting'],
        operation: ['updateMeetingState'],
      },
    },
  },
  {
    displayName: 'Prompt',
    name: 'prompt',
    type: 'string',
    typeOptions: { rows: 2 },
    required: true,
    default: '',
    placeholder: 'e.g. Follow up with the design team about the launch date',
    displayOptions: {
      show: {
        resource: ['meeting'],
        operation: ['createLiveActionItem', 'createLiveSoundbite'],
      },
    },
    description: 'What Fred should create, in plain language (5 to 255 characters)',
  },
  {
    displayName: 'Meeting Link',
    name: 'meetingLink',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['meeting'],
        operation: ['addToLiveMeeting'],
      },
    },
    description: 'The URL of the live meeting to join',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['meeting'],
        operation: ['addToLiveMeeting'],
      },
    },
    options: [
      {
        displayName: 'Attendees',
        name: 'attendees',
        type: 'fixedCollection',
        typeOptions: { multipleValues: true },
        default: {},
        description: 'Attendees, used to push notes to connected CRMs',
        options: [
          {
            name: 'attendeeValues',
            displayName: 'Attendee',
            values: [
              { displayName: 'Display Name', name: 'displayName', type: 'string', default: '' },
              {
                displayName: 'Email',
                name: 'email',
                type: 'string',
                placeholder: 'name@email.com',
                default: '',
              },
              { displayName: 'Phone Number', name: 'phoneNumber', type: 'string', default: '' },
            ],
          },
        ],
      },
      {
        displayName: 'Duration',
        name: 'duration',
        type: 'number',
        typeOptions: {
          minValue: 15,
          maxValue: 120,
        },
        default: 60,
        description: 'Meeting duration in minutes (15 to 120)',
      },
      {
        displayName: 'Language',
        name: 'language',
        type: 'string',
        default: '',
        description: 'Language for transcription (e.g., en-US)',
      },
      {
        displayName: 'Meeting Password',
        name: 'meetingPassword',
        type: 'string',
        typeOptions: {
          password: true,
        },
        default: '',
        description: 'Password for the meeting if required',
      },
      {
        displayName: 'Title',
        name: 'title',
        type: 'string',
        default: '',
        description: 'Title for the meeting recording',
      },
    ],
  },
];
