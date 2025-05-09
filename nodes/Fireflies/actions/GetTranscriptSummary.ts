import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { callGraphQLApi } from '../transport';
import { getMeetingSummaryQuery } from '../helpers/queries';

export async function executeGetTranscriptSummary(this: IExecuteFunctions, i: number, apiKey: string): Promise<INodeExecutionData> {
    const transcriptId = this.getNodeParameter('transcriptId', i) as string;

    const response = await callGraphQLApi(apiKey, getMeetingSummaryQuery, { transcriptId });

    return { json: response.data.data.transcript };
}
