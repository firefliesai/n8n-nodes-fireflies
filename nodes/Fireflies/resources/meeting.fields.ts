import { INodeProperties } from 'n8n-workflow';

export const meetingFields: INodeProperties[] = [
	{
		displayName: 'Meeting Link',
		name: 'meetingLink',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['meeting'],
				operation: ['addToLiveMeeting'],
			},
		},
		description: 'The URL of the live meeting to join',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['meeting'],
				operation: ['addToLiveMeeting'],
			},
		},
		options: [
			{
				displayName: 'Duration',
				name: 'duration',
				type: 'number',
				typeOptions: {
					minValue: 1,
				},
				default: 60,
				description: 'Meeting duration in minutes',
			},
			{
				displayName: 'Language',
				name: 'language',
				type: 'string',
				default: '',
				description: 'Language for transcription (e.g., en-US)',
			},
			{
				displayName: 'Meeting Password',
				name: 'meetingPassword',
				type: 'string',
				typeOptions: {
					password: true,
				},
				default: '',
				description: 'Password for the meeting if required',
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
				description: 'Title for the meeting recording',
			},
		],
	},
];
