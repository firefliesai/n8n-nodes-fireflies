import { INodeProperties } from 'n8n-workflow';

export const ruleExecutionOperations: INodeProperties = {
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['ruleExecution'],
    },
  },
  options: [
    {
      name: 'Get Many',
      action: 'Get many rule executions',
      description:
        'Get automation rule executions grouped by meeting. Requires an Enterprise plan.',
      value: 'getRuleExecutions',
    },
  ],
  default: 'getRuleExecutions',
};
