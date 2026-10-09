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
      name: 'Add to Group',
      action: 'Add a user to a user group',
      description:
        'Add a teammate to a user group by email. Requires a team admin on Business or higher.',
      value: 'addUserToUserGroup',
    },
    {
      name: 'Get',
      action: 'Get a user',
      description: 'Get a teammate by user ID',
      value: 'getUser',
    },
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
      name: 'Remove From Group',
      action: 'Remove a user from a user group',
      description:
        'Remove a member from a user group by email. Requires a team admin on Business or higher.',
      value: 'removeUserFromUserGroup',
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
