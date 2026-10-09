import { INodeProperties } from 'n8n-workflow';

const show = { resource: ['ruleExecution'], operation: ['getRuleExecutions'] };

export const ruleExecutionFields: INodeProperties[] = [
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
      {
        displayName: 'Executions',
        name: 'is_test',
        type: 'options',
        options: [
          { name: 'All', value: 'any' },
          { name: 'Production Only', value: 'false' },
          { name: 'Test Only', value: 'true' },
        ],
        default: 'any',
      },
      {
        displayName: 'Logs per Meeting',
        name: 'logs_per_meeting',
        type: 'number',
        typeOptions: { minValue: 1, maxValue: 20 },
        default: 5,
        description: 'Max execution logs returned per meeting',
      },
      {
        displayName: 'Meeting ID',
        name: 'meeting_id',
        type: 'string',
        default: '',
      },
      {
        displayName: 'Rule ID',
        name: 'rule_id',
        type: 'string',
        default: '',
      },
    ],
  },
];
