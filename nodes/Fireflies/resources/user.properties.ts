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
      name: 'Get Groups',
      action: 'Get user groups',
      description: 'Get a list of user groups in the workspace',
      value: 'getUserGroups',
    },
    {
      name: 'Get List',
      action: 'Get a list of users',
      description: 'Get a list of users',
      value: 'getUsers',
    },
    {
      name: 'Set Role',
      action: 'Set user role',
      description: 'Change the role of a user in the workspace',
      value: 'setUserRole',
    },
  ],
  default: 'getCurrentUser',
};
