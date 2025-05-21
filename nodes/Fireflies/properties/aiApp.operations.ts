import { INodeProperties } from 'n8n-workflow';

export const aiAppOperations: INodeProperties = {
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['aiApp'],
    },
  },
  options: [
    {
      name: 'Get Outputs',
      action: 'Get outputs of an AI app',
      description: 'Retrieve AI app outputs',
      value: 'getAIAppOutputs',
    },
  ],
  default: 'getAIAppOutputs',
};
