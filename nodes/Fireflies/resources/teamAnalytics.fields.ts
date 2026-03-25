import { INodeProperties } from 'n8n-workflow';

export const teamAnalyticsFields: INodeProperties[] = [
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['teamAnalytics'],
				operation: ['getTeamAnalytics'],
			},
		},
		options: [
			{
				displayName: 'End Time',
				name: 'endTime',
				type: 'string',
				default: '',
				description: 'End of the analytics period (ISO date string)',
			},
			{
				displayName: 'Start Time',
				name: 'startTime',
				type: 'string',
				default: '',
				description: 'Start of the analytics period (ISO date string)',
			},
		],
	},
];
