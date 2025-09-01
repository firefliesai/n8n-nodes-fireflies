import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { callGraphQLApi } from '../../transport';
import { getTranscriptAnalyticsQuery } from '../../helpers';
import { handleOperationError } from '../../helpers';

export async function getTranscriptAnalytics(ef: IExecuteFunctions, index: number): Promise<INodeExecutionData> {
  try {
    const transcriptId = ef.getNodeParameter('transcriptId', index) as string;

    const response = await callGraphQLApi.call(ef, getTranscriptAnalyticsQuery, { transcriptId });

    return {
      json: {
        success: true,
        data: response.transcript,
      },
    };
  } catch (error) {
    const errorResponse = handleOperationError(
      ef.getNode(),
      error,
      ef.continueOnFail(),
      'getTranscriptAnalytics'
    );

    return {
      json: errorResponse,
    };
  }
}
