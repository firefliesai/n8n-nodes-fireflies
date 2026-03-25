import { INodeProperties } from 'n8n-workflow';

export const teamAnalyticsOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['teamAnalytics'],
		},
	},
	options: [
		{
			name: 'Get Team Analytics',
			action: 'Get team analytics',
			description: 'Get analytics for the entire team. Requires admin privileges.',
			value: 'getTeamAnalytics',
		},
	],
	default: 'getTeamAnalytics',
};
