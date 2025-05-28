import { IExecuteFunctions, INodeExecutionData, NodeOperationError } from 'n8n-workflow';
import { callGraphQLApi } from '../../transport';
import { getTranscriptAnalyticsQuery } from '../../helpers/queries';

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
    const errorData = {
      success: false,
      error: {
        message: error.message,
        details: 'Error retrieving transcript analytics',
        code: error.code || 'UNKNOWN_ERROR',
        timestamp: new Date().toISOString(),
      },
    };

    if (!ef.continueOnFail()) {
      throw new NodeOperationError(ef.getNode(), error.message, {
        message: errorData.error.message,
        description: errorData.error.details,
      });
    }

    return {
      json: errorData,
    };
  }
}
