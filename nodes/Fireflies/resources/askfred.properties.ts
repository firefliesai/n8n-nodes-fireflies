import { INodeProperties } from 'n8n-workflow';

export const askfredOperations: INodeProperties = {
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['askfred'],
    },
  },
  options: [
    {
      name: 'Continue Thread',
      action: 'Continue an existing ask fred thread',
      description: 'Continue an existing conversation thread with a follow-up question',
      value: 'continueThread',
    },
    {
      name: 'Create Thread',
      action: 'Create a new ask fred thread',
      description: 'Create a new conversation thread with a question about meetings',
      value: 'createThread',
    },
    {
      name: 'Delete Thread',
      action: 'Delete an ask fred thread',
      description: 'Delete a conversation thread and all its messages',
      value: 'deleteThread',
    },
    {
      name: 'Get Thread',
      action: 'Get an ask fred thread',
      description: 'Get a specific thread with all its messages',
      value: 'getThread',
    },
    {
      name: 'Get Threads',
      action: 'Get ask fred threads',
      description: 'Get a list of all conversation threads',
      value: 'getThreads',
    },
  ],
  default: 'getThreads',
};
