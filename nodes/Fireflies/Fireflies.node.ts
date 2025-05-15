import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	NodeOperationError,
} from 'n8n-workflow';

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
					{ name: 'Get AI App Outputs', value: 'getAIAppOutputs' },
					{ name: 'Get Current User', value: 'getCurrentUser' },
					{ name: 'Get Transcript', value: 'getTranscript' },
					{ name: 'Get Transcript Analytics', value: 'getTranscriptAnalytics' },
					{ name: 'Get Transcript Summary', value: 'getTranscriptSummary' },
					{ name: 'Get Transcripts List', value: 'getTranscriptsList' },
					{ name: 'Get Users', value: 'getUsers' },
					{ name: 'Upload Audio', value: 'uploadAudio' },
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

		const operationHandlers = {
			getTranscript: actions.executeGetTranscript.bind(this),
			uploadAudio: actions.executeUploadAudio.bind(this),
			getTranscriptAnalytics: actions.executeGetTranscriptAnalytics.bind(this),
			getTranscriptSummary: actions.executeGetTranscriptSummary.bind(this),
			getTranscriptsList: actions.executeGetTranscriptsList.bind(this),
			getAIAppOutputs: actions.executeGetAIAppOutputs.bind(this),
			getUsers: actions.executeGetUsers.bind(this),
			getCurrentUser: actions.executeGetCurrentUser.bind(this),
		};

		for (let i = 0; i < items.length; i++) {
			const operation = this.getNodeParameter('operation', i) as keyof typeof operationHandlers;
			const handler = operationHandlers[operation];

			try {
				if (!handler) throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
				const result = await handler(i);
				returnData.push(...(Array.isArray(result) ? result : [result]));
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
