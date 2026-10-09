import { INodeProperties } from 'n8n-workflow';

const show = { resource: ['auditEvent'], operation: ['getAuditEvents'] };

const AUDIT_ACTIONS = [
  'MEETING_DELETED',
  'MEETING_PRIVACY_UPDATED',
  'MEETING_VIEWED',
  'MEETING_SHARED',
  'MEETING_ACCESS_REVOKED',
  'MEETING_DOWNLOADED',
  'MEETING_TITLE_UPDATED',
  'MEETING_MOVED_TO_CHANNEL',
  'SOUNDBITE_CREATED',
  'TEAMMATE_ADDED',
  'TEAMMATE_REMOVED',
  'USER_ROLE_CHANGED',
  'USER_GROUP_MEMBER_ADDED',
  'USER_GROUP_MEMBER_REMOVED',
  'SETTINGS_UPDATED',
  'LOGIN',
  'LOGOUT',
];

const toLabel = (value: string) =>
  value
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export const auditEventFields: INodeProperties[] = [
  {
    displayName: 'Category',
    name: 'category',
    type: 'options',
    required: true,
    options: [
      { name: 'Authentication', value: 'AUTHENTICATION' },
      { name: 'Meeting Operations', value: 'MEETING_OPERATIONS' },
      { name: 'Team Operations', value: 'TEAM_OPERATIONS' },
      { name: 'User Operations', value: 'USER_OPERATIONS' },
    ],
    default: 'MEETING_OPERATIONS',
    displayOptions: { show },
  },
  {
    displayName: 'Return All',
    name: 'returnAll',
    type: 'boolean',
    default: false,
    displayOptions: { show },
    description: 'Whether to return all results or only up to a given limit',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    typeOptions: { minValue: 1 },
    default: 50,
    displayOptions: { show: { ...show, returnAll: [false] } },
    description: 'Max number of results to return',
  },
  {
    displayName: 'Filters',
    name: 'filters',
    type: 'collection',
    placeholder: 'Add Filter',
    default: {},
    displayOptions: { show },
    options: [
      {
        displayName: 'Action',
        name: 'action',
        type: 'options',
        options: AUDIT_ACTIONS.map((value) => ({ name: toLabel(value), value })),
        default: '',
      },
      {
        displayName: 'Actor Email',
        name: 'actor_email',
        type: 'string',
        placeholder: 'name@email.com',
        default: '',
        description: 'Only events by this user. Takes precedence over Actor User ID.',
      },
      {
        displayName: 'Actor User ID',
        name: 'actor_user_id',
        type: 'string',
        default: '',
        description: 'Only events by this user ID',
      },
      {
        displayName: 'Cursor',
        name: 'cursor',
        type: 'string',
        default: '',
        description: 'Start from this page: the next_cursor of an earlier run',
      },
      {
        displayName: 'Date From',
        name: 'date_from',
        type: 'dateTime',
        default: '',
      },
      {
        displayName: 'Date To',
        name: 'date_to',
        type: 'dateTime',
        default: '',
      },
    ],
  },
];
