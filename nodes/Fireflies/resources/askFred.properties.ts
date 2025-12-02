import { INodeProperties } from 'n8n-workflow';

export const askFredOperations: INodeProperties = {
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['askFred'],
    },
  },
  options: [
    {
      name: 'Continue Thread',
      action: 'Continue an ask fred thread',
      description: 'Continue an existing AskFred conversation thread',
      value: 'continueThread',
    },
    {
      name: 'Create Thread',
      action: 'Create an ask fred thread',
      description: 'Create a new AskFred conversation thread with a question',
      value: 'createThread',
    },
    {
      name: 'Delete Thread',
      action: 'Delete an ask fred thread',
      description: 'Delete an AskFred thread and all its messages',
      value: 'deleteThread',
    },
    {
      name: 'Get Thread',
      action: 'Get an ask fred thread',
      description: 'Get a specific AskFred thread by ID with all its messages',
      value: 'getThread',
    },
    {
      name: 'Get Threads',
      action: 'Get ask fred threads',
      description: 'Get a summary of all AskFred threads for the current user',
      value: 'getThreads',
    },
  ],
  default: 'createThread',
};
