import { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription, NodeConnectionType, NodeOperationError } from 'n8n-workflow';
import { executeGetTranscript } from './actions/GetTranscript';
import { executeUploadAudio, UploadAudioProperties } from './actions/UploadAudio';
import { executeGetTranscriptAnalytics } from './actions/GetTranscriptAnalytics';
import { executeGetTranscriptSummary } from './actions/GetTranscriptSummary';
import { executeGetTranscriptsList, GetTranscriptsListProperties } from './actions/GetTranscriptsList';
import { executeGetAIAppOutputs, GetAIAppOutputsProperties } from './actions/GetAIAppOutputs';
import { executeGetUsers } from './actions/GetUsers';
import { executeGetCurrentUser } from './actions/GetCurrentUser';
export class Fireflies implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Fireflies',
		name: 'fireflies',
		group: ['transform'],
		version: 1,
		description: 'Interact with the Fireflies.ai API',
		defaults: {
			name: 'Fireflies',
		},
		inputs: ['main'] as NodeConnectionType[],
		outputs: ['main'] as NodeConnectionType[],
		credentials: [
			{
				name: 'firefliesApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Get AI App Outputs',
						value: 'getAIAppOutputs',
						action: 'Get AI app outputs',
					},
					{
						name: 'Get Current User',
						value: 'getCurrentUser',
						action: 'Get current user',
					},
					{
						name: 'Get Transcript',
						value: 'getTranscript',
						description: 'Fetch a transcript by ID',
						action: 'Fetch a transcript by ID',
					},
					{
						name: 'Get Transcript Analytics',
						value: 'getTranscriptAnalytics',
						action: 'Get transcript analytics',
					},
					{
						name: 'Get Transcript Summary',
						value: 'getTranscriptSummary',
						action: 'Get transcript summary',
					},
					{
						name: 'Get Transcripts List',
						value: 'getTranscriptsList',
						action: 'Get transcripts list',
					},
					{
						name: 'Get Users',
						value: 'getUsers',
						action: 'Get users',
					},
					{
						name: 'Upload Audio',
						value: 'uploadAudio',
						description: 'Upload an audio file for transcription',
						action: 'Upload an audio file for transcription',
					},
				],
				default: 'getTranscript',
			},
			{
				displayName: 'Transcript ID',
				name: 'transcriptId',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['getTranscript', 'getTranscriptAnalytics', 'getTranscriptSummary'],
					},
				},
			},
			...GetAIAppOutputsProperties,
			...UploadAudioProperties,
			...GetTranscriptsListProperties,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			const operation = this.getNodeParameter('operation', i) as string;
			const credentials = await this.getCredentials('firefliesApi');
			const apiKey = credentials.apiKey as string;

			try {
				if (operation === 'getTranscript') {
					returnData.push(await executeGetTranscript.call(this, i, apiKey));
				} else if (operation === 'uploadAudio') {
					returnData.push(await executeUploadAudio.call(this, i, apiKey));
				} else if (operation === 'getTranscriptAnalytics') {
					returnData.push(await executeGetTranscriptAnalytics.call(this, i, apiKey));
				} else if (operation === 'getTranscriptSummary') {
					returnData.push(await executeGetTranscriptSummary.call(this, i, apiKey));
				} else if (operation === 'getTranscriptsList') {
					returnData.push(await executeGetTranscriptsList.call(this, i, apiKey));
				} else if (operation === 'getAIAppOutputs') {
					returnData.push(await executeGetAIAppOutputs.call(this, i, apiKey));
				} else if (operation === 'getUsers') {
					returnData.push(await executeGetUsers.call(this, i, apiKey));
				} else if (operation === 'getCurrentUser') {
					returnData.push(await executeGetCurrentUser.call(this, i, apiKey));
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: error.message }, pairedItem: i });
					continue;
				}
				throw new NodeOperationError(this.getNode(), error, { itemIndex: i });
			}
		}

		return [returnData];
	}
}