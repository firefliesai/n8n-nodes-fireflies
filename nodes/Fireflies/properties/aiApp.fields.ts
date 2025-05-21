import { INodeProperties } from 'n8n-workflow';

export const aiAppFields: INodeProperties[] = [
  {
    displayName: 'App ID',
    name: 'appId',
    type: 'string',
    default: '',
    displayOptions: {
      show: {
        resource: ['aiApp'],
        operation: ['getAIAppOutputs'],
      },
    },
    description: 'ID of the app to get outputs for',
  },
  {
    displayName: 'Transcript ID',
    name: 'transcriptId',
    type: 'string',
    default: '',
    displayOptions: {
      show: {
        resource: ['aiApp'],
        operation: ['getAIAppOutputs'],
      },
    },
    description: 'ID of the transcript to get app outputs for',
  },
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: {
      show: {
        resource: ['aiApp'],
        operation: ['getAIAppOutputs'],
      },
    },
    description: 'Whether to return all results or only up to a given limit',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    // eslint-disable-next-line n8n-nodes-base/node-param-default-wrong-for-limit
    default: 10,
    typeOptions: {
      minValue: 1,
      // eslint-disable-next-line n8n-nodes-base/node-param-type-options-max-value-present
      maxValue: 10,
    },
    displayOptions: {
      show: {
        resource: ['aiApp'],
        operation: ['getAIAppOutputs'],
        returnAll: [false],
      },
    },
    description: 'Max number of results to return',
  },
  {
    displayName: 'Skip',
    name: 'skip',
    type: 'number',
    default: 0,
    typeOptions: {
      minValue: 0,
    },
    displayOptions: {
      show: {
        resource: ['aiApp'],
        operation: ['getAIAppOutputs'],
      },
    },
    description: 'Number of results to skip',
  },
];
