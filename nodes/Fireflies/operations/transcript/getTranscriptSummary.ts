import { IExecuteFunctions, INodeExecutionData, NodeOperationError } from 'n8n-workflow';
import { callGraphQLApi } from '../../transport';
import { getTranscriptSummaryQuery } from '../../helpers/queries';

export async function getTranscriptSummary(ef: IExecuteFunctions): Promise<INodeExecutionData> {
  try {
    const transcriptId = ef.getNodeParameter('transcriptId', 0) as string;

    const response = await callGraphQLApi.call(ef, getTranscriptSummaryQuery, { transcriptId });

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
        details: 'Error retrieving transcript summary',
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
