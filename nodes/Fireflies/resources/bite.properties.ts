import { INodeProperties } from 'n8n-workflow';

export const biteOperations: INodeProperties = {
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['bite'],
    },
  },
  options: [
    {
      name: 'Create',
      action: 'Create a bite',
      description: 'Create a new bite clip from a transcript',
      value: 'createBite',
    },
    {
      name: 'Get',
      action: 'Get a bite',
      description: 'Get details of a specific bite',
      value: 'getBite',
    },
    {
      name: 'Get List',
      action: 'Get a list of bites',
      description: 'Get a list of bite clips',
      value: 'getBites',
    },
  ],
  default: 'getBites',
};
