import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { callGraphQLApi } from '../transport';
import { getTranscriptQuery } from '../helpers/queries';

export async function executeGetTranscript(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
	const transcriptId = this.getNodeParameter('transcriptId', i) as string;

	const response = await callGraphQLApi.call(this, getTranscriptQuery, { transcriptId });

	return { json: response.transcript };
}
