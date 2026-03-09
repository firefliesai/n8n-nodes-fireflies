import { INodeProperties } from 'n8n-workflow';

export const contactOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['contact'],
		},
	},
	options: [
		{
			name: 'Get List',
			action: 'Get a list of contacts',
			description: 'Get all contacts in the workspace',
			value: 'getContacts',
		},
	],
	default: 'getContacts',
};
