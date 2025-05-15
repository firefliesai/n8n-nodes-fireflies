import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { callGraphQLApi } from '../transport';
import { getTranscriptSummaryQuery } from '../helpers/queries';

export async function executeGetTranscriptSummary(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
    const transcriptId = this.getNodeParameter('transcriptId', i) as string;

    const response = await callGraphQLApi.call(this, getTranscriptSummaryQuery, { transcriptId });

    return { json: response.transcript };
}
