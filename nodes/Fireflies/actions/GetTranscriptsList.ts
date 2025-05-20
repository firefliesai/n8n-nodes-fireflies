import { IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { callGraphQLApi } from '../transport';
import { getTranscriptsListQuery } from '../helpers/queries';

export async function executeGetTranscriptsList(this: IExecuteFunctions, i: number): Promise<INodeExecutionData[]> {
	const limit = this.getNodeParameter('limit', i, 50) as number;
	const skip = this.getNodeParameter('skip', i, 0) as number;
	
	const filters = this.getNodeParameter('filters', i, {}) as {
		title?: string;
		date?: number;
		fromDate?: string;
		toDate?: string;
		hostEmail?: string;
		organizerEmail?: string;
		participantEmail?: string;
		userId?: string;
		mine?: boolean;
	};

	const variables: Record<string, any> = {
		limit,
		skip,
	};

	if (filters.title) variables.title = filters.title;
	if (filters.date !== undefined) variables.date = filters.date;
	if (filters.fromDate) variables.fromDate = filters.fromDate;
	if (filters.toDate) variables.toDate = filters.toDate;
	if (filters.hostEmail) variables.hostEmail = filters.hostEmail;
	if (filters.organizerEmail) variables.organizerEmail = filters.organizerEmail;
	if (filters.participantEmail) variables.participantEmail = filters.participantEmail;
	if (filters.userId) variables.userId = filters.userId;
	if (filters.mine !== undefined) variables.mine = filters.mine;

	const response = await callGraphQLApi.call(this, getTranscriptsListQuery, variables);

	return response.transcripts.map((transcript: any) => ({ json: transcript }));
}

export const GetTranscriptsListProperties: INodeProperties[] = [
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
		},
		default: 50,
		description: 'Max number of results to return',
		displayOptions: {
			show: {
				operation: ['getTranscriptsList'],
			},
		},
	},
	{
		displayName: 'Skip',
		name: 'skip',
		type: 'number',
		default: 0,
		description: 'Offset for pagination',
		displayOptions: {
			show: {
				operation: ['getTranscriptsList'],
			},
		},
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				operation: ['getTranscriptsList'],
			},
		},
		options: [
			{
				displayName: 'Date',
				name: 'date',
				type: 'number',
				typeOptions: {
					minValue: 0,
				},
				default: undefined,
				description: 'Filter by timestamp',
			},
			{
				displayName: 'From Date',
				name: 'fromDate',
				type: 'string',
				default: '',
				description: 'Start date (ISO format)',
			},
			{
				displayName: 'Host Email',
				name: 'hostEmail',
				type: 'string',
				default: '',
				description: 'Filter by host email (deprecated)',
			},
			{
				displayName: 'Mine',
				name: 'mine',
				type: 'boolean',
				default: false,
			},
			{
				displayName: 'Organizer Email',
				name: 'organizerEmail',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Participant Email',
				name: 'participantEmail',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Title',
				name: 'title',
				type: 'string',
				default: '',
				description: 'Filter transcripts by title',
			},
			{
				displayName: 'To Date',
				name: 'toDate',
				type: 'string',
				default: '',
				description: 'End date (ISO format)',
			},
			{
				displayName: 'User ID',
				name: 'userId',
				type: 'string',
				default: '',
			},
		],
	},
];
