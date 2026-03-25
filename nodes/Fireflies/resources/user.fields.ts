import { INodeProperties } from 'n8n-workflow';

export const userFields: INodeProperties[] = [
  {
    displayName: 'User ID',
    name: 'userId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['setUserRole'],
      },
    },
    description: 'ID of the user to update',
  },
  {
    displayName: 'Role',
    name: 'role',
    type: 'options',
    required: true,
    options: [
      { name: 'Admin', value: 'admin' },
      { name: 'User', value: 'user' },
    ],
    default: 'user',
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['setUserRole'],
      },
    },
    description: 'New role to assign to the user',
  },
  {
    displayName: 'Additional Fields',
    name: 'additionalFields',
    type: 'collection',
    placeholder: 'Add Field',
    default: {},
    displayOptions: {
      show: {
        resource: ['user'],
        operation: ['getUserGroups'],
      },
    },
    options: [
      {
        displayName: 'Mine',
        name: 'mine',
        type: 'boolean',
        default: false,
        description: 'Whether to return only groups the current user belongs to',
      },
    ],
  },
];
