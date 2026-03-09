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
    default: 0,
    description: 'Offset for pagination',
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
        operation: ['getBites'],
      },
    },
    options: [
      {
        displayName: 'Mine',
        name: 'mine',
        type: 'boolean',
        default: false,
        description: 'Whether to only return bites created by you',
      },
      {
        displayName: 'My Team',
        name: 'myTeam',
        type: 'boolean',
        default: false,
        description: 'Whether to only return bites from your team',
      },
      {
        displayName: 'Transcript ID',
        name: 'transcriptId',
        type: 'string',
        default: '',
        description: 'Filter bites by transcript ID',
      },
    ],
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
        description: 'Comma-separated list, e.g. PUBLIC,PRIVATE',
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
