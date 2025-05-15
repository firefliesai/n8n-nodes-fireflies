import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { callGraphQLApi } from '../transport';
import { getTranscriptAnalyticsQuery } from '../helpers/queries';

export async function executeGetTranscriptAnalytics(this: IExecuteFunctions, i: number): Promise<INodeExecutionData> {
    const transcriptId = this.getNodeParameter('transcriptId', i) as string;

    const response = await callGraphQLApi.call(this, getTranscriptAnalyticsQuery, { transcriptId });

    return { json: response.transcript };
}
