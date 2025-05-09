import { IExecuteFunctions, INodeExecutionData, INodeProperties } from 'n8n-workflow';
import { callGraphQLApi } from '../transport';
import { getTranscriptsListQuery } from '../helpers/queries';

export async function executeGetTranscriptsList(this: IExecuteFunctions, i: number, apiKey: string): Promise<INodeExecutionData> {
	const title = this.getNodeParameter('title', i, '') as string;
	const date = this.getNodeParameter('date', i, null) as number | null;
	const fromDate = this.getNodeParameter('fromDate', i, '') as string;
	const toDate = this.getNodeParameter('toDate', i, '') as string;
	const limit = this.getNodeParameter('limit', i, 50) as number;
	const skip = this.getNodeParameter('skip', i, 0) as number;
	const hostEmail = this.getNodeParameter('hostEmail', i, '') as string;
	const organizerEmail = this.getNodeParameter('organizerEmail', i, '') as string;
	const participantEmail = this.getNodeParameter('participantEmail', i, '') as string;
	const userId = this.getNodeParameter('userId', i, '') as string;
	const mine = this.getNodeParameter('mine', i, false) as boolean;

	const variables: Record<string, any> = {};

	if (title) variables.title = title;
	if (date !== null) variables.date = date;
	if (fromDate) variables.fromDate = fromDate;
	if (toDate) variables.toDate = toDate;
	if (limit) variables.limit = limit;
	if (skip) variables.skip = skip;
	if (hostEmail) variables.hostEmail = hostEmail;
	if (organizerEmail) variables.organizerEmail = organizerEmail;
	if (participantEmail) variables.participantEmail = participantEmail;
	if (userId) variables.userId = userId;
	if (mine) variables.mine = mine;

	const response = await callGraphQLApi(apiKey, getTranscriptsListQuery, variables);

	return { json: response.transcripts };
}

export const GetTranscriptsListProperties: INodeProperties[] = [
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		default: '',
		description: 'Filter transcripts by title',
		displayOptions: {
			show: {
				operation: ['getTranscriptsList'],
			},
		},
	},
	{
		displayName: 'Date',
		name: 'date',
		type: 'number',
		typeOptions: {
			minValue: 0,
		},
		default: undefined,
		description: 'Filter by timestamp',
		displayOptions: {
			show: {
				operation: ['getTranscriptsList'],
			},
		},
	},
	{
		displayName: 'From Date',
		name: 'fromDate',
		type: 'string',
		default: '',
		description: 'Start date (ISO format)',
		displayOptions: {
			show: {
				operation: ['getTranscriptsList'],
			},
		},
	},
	{
		displayName: 'To Date',
		name: 'toDate',
		type: 'string',
		default: '',
		description: 'End date (ISO format)',
		displayOptions: {
			show: {
				operation: ['getTranscriptsList'],
			},
		},
	},
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
		displayName: 'Host Email',
		name: 'hostEmail',
		type: 'string',
		default: '',
		description: 'Filter by host email (deprecated)',
		displayOptions: {
			show: {
				operation: ['getTranscriptsList'],
			},
		},
	},
	{
		displayName: 'Organizer Email',
		name: 'organizerEmail',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				operation: ['getTranscriptsList'],
			},
		},
	},
	{
		displayName: 'Participant Email',
		name: 'participantEmail',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				operation: ['getTranscriptsList'],
			},
		},
	},
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				operation: ['getTranscriptsList'],
			},
		},
	},
	{
		displayName: 'Mine',
		name: 'mine',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				operation: ['getTranscriptsList'],
			},
		},
	},
];
