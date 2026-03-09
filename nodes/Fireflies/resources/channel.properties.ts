import { INodeProperties } from 'n8n-workflow';

export const channelOperations: INodeProperties = {
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['channel'] } },
  options: [
    {
      name: 'Get',
      action: 'Get a channel',
      description: 'Get details of a specific channel',
      value: 'getChannel',
    },
    {
      name: 'Get List',
      action: 'Get a list of channels',
      description: 'Get all channels in the workspace',
      value: 'getChannels',
    },
  ],
  default: 'getChannels',
};
