import { INodeProperties } from 'n8n-workflow';

export const channelFields: INodeProperties[] = [
  {
    displayName: 'Channel ID',
    name: 'channelId',
    type: 'string',
    required: true,
    default: '',
    displayOptions: { show: { resource: ['channel'], operation: ['getChannel'] } },
    description: 'ID of the channel to retrieve',
  },
];
