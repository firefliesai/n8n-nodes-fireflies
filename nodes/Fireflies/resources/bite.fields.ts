import { INodeProperties } from 'n8n-workflow';

export const biteFields: INodeProperties[] = [
  {
    displayName: 'Bite ID',
    name: 'biteId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['bite'],
        operation: ['getBite'],
      },
    },
    description: 'ID of the bite to retrieve',
  },
  {
    displayName: 'Transcript ID',
    name: 'transcriptId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['bite'],
        operation: ['createBite'],
      },
    },
    description: 'ID of the transcript to create a bite from',
  },
  {
    displayName: 'Start Time',
    name: 'startTime',
    type: 'number',
    typeOptions: {
      minValue: 0,
    },
    required: true,
    default: 0,
    displayOptions: {
      show: {
        resource: ['bite'],
        operation: ['createBite'],
      },
    },
    description: 'Start time in seconds',
  },
  {
    displayName: 'End Time',
    name: 'endTime',
    type: 'number',
    typeOptions: {
      minValue: 0,
    },
    required: true,
    default: 0,
    displayOptions: {
      show: {
        resource: ['bite'],
        operation: ['createBite'],
      },
    },
    description: 'End time in seconds',
  },
  {
    displayName: 'Filter By',
    name: 'filterBy',
    type: 'options',
    required: true,
    default: 'mine',
    displayOptions: {
      show: {
        resource: ['bite'],
        operation: ['getBites'],
      },
    },
    options: [
      {
        name: 'Mine',
        value: 'mine',
        description: 'Return only bites created by you',
      },
      {
        name: 'My Team',
        value: 'myTeam',
        description: 'Return bites from your team',
      },
      {
        name: 'Transcript',
        value: 'transcript',
        description: 'Return bites from a specific transcript',
      },
    ],
    description: 'How to filter the bites list',
  },
  {
    displayName: 'Transcript ID',
    name: 'transcriptId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['bite'],
        operation: ['getBites'],
        filterBy: ['transcript'],
      },
    },
    description: 'ID of the transcript to filter bites by',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    typeOptions: {
      minValue: 1,
    },
    default: 10,
    description: 'Max number of results to return',
    displayOptions: {
      show: {
        resource: ['bite'],
        operation: ['getBites'],
      },
    },
  },
  {
    displayName: 'Skip',
    name: 'skip',
    type: 'number',
    typeOptions: {
      minValue: 0,
    },
    default: 0,
    description: 'Number of results to skip for pagination',
    displayOptions: {
      show: {
        resource: ['bite'],
        operation: ['getBites'],
      },
    },
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['bite'],
        operation: ['createBite'],
      },
    },
    options: [
      {
        displayName: 'Media Type',
        name: 'mediaType',
        type: 'string',
        default: '',
        description: 'Media type for the bite',
      },
      {
        displayName: 'Name',
        name: 'name',
        type: 'string',
        default: '',
        description: 'Name for the bite',
      },
      {
        displayName: 'Privacies',
        name: 'privacies',
        type: 'string',
        default: '',
        description: 'Comma-separated list of privacy values, e.g. public,team,participants',
      },
      {
        displayName: 'Summary',
        name: 'summary',
        type: 'string',
        default: '',
        description: 'Summary text for the bite',
      },
    ],
  },
];
