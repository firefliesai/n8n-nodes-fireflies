import { INodeProperties } from 'n8n-workflow';

export const userOperations: INodeProperties = {
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['user'],
    },
  },
  options: [
    {
      name: 'Get Current',
      action: 'Get current user',
      description: 'Get information about the current user',
      value: 'getCurrentUser',
    },
    {
      name: 'Get List',
      action: 'Get a list of users',
      description: 'Get a list of users',
      value: 'getUsers',
    },
  ],
  default: 'getCurrentUser',
};
