import { IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription, NodeConnectionType, NodeOperationError } from 'n8n-workflow';
import * as actions from './actions';
export class Fireflies implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Fireflies',
		name: 'fireflies',
		group: ['transform'],
		icon: 'file:fireflies.svg',
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
			...actions.GetAIAppOutputsProperties,
			...actions.UploadAudioProperties,
			...actions.GetTranscriptsListProperties,
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
					returnData.push(await actions.executeGetTranscript.call(this, i, apiKey));
				} else if (operation === 'uploadAudio') {
					returnData.push(await actions.executeUploadAudio.call(this, i, apiKey));
				} else if (operation === 'getTranscriptAnalytics') {
					returnData.push(await actions.executeGetTranscriptAnalytics.call(this, i, apiKey));
				} else if (operation === 'getTranscriptSummary') {
					returnData.push(await actions.executeGetTranscriptSummary.call(this, i, apiKey));
				} else if (operation === 'getTranscriptsList') {
					const transcripts = await actions.executeGetTranscriptsList.call(this, i, apiKey);
					returnData.push(...transcripts);
				} else if (operation === 'getAIAppOutputs') {
					const outputs = await actions.executeGetAIAppOutputs.call(this, i, apiKey);
					returnData.push(...outputs);
				} else if (operation === 'getUsers') {
					const users = await actions.executeGetUsers.call(this, i, apiKey);
					returnData.push(...users);
				} else if (operation === 'getCurrentUser') {
					returnData.push(await actions.executeGetCurrentUser.call(this, i, apiKey));
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