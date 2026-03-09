import { INodeProperties } from 'n8n-workflow';

export const meetingOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['meeting'],
		},
	},
	options: [
		{
			name: 'Add to Live Meeting',
			action: 'Add Fred to a live meeting',
			description: 'Add the Fireflies bot to an active meeting',
			value: 'addToLiveMeeting',
		},
		{
			name: 'Get Active Meetings',
			action: 'Get active meetings',
			description: 'Get a list of currently active meetings',
			value: 'getActiveMeetings',
		},
	],
	default: 'getActiveMeetings',
};
