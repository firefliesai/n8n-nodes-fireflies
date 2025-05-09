import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { callGraphQLApi } from '../transport';
import { getTranscriptQuery } from '../helpers/queries';

export async function executeGetTranscript(this: IExecuteFunctions, i: number, apiKey: string): Promise<INodeExecutionData> {
	const transcriptId = this.getNodeParameter('transcriptId', i) as string;

	const response = await callGraphQLApi(apiKey, getTranscriptQuery, { transcriptId });

	return { json: response.transcript };
}
