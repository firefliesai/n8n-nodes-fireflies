import { IExecuteFunctions, INodeExecutionData, NodeOperationError } from 'n8n-workflow';
import { callGraphQLApi } from '../../transport';
import { getAIAppOutputsQuery } from '../../helpers/queries';

export async function getAIAppOutputs(ef: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
  try {
    const appId = ef.getNodeParameter('appId', index, '') as string;
    const transcriptId = ef.getNodeParameter('transcriptId', index, '') as string;
    const limit = ef.getNodeParameter('limit', index, 10) as number;
    const skip = ef.getNodeParameter('skip', index, 0) as number;

    const response = await callGraphQLApi.call(ef, getAIAppOutputsQuery, {
      appId: appId || undefined,
      transcriptId: transcriptId || undefined,
      skip,
      limit: limit || undefined,
    });

    return response.apps.outputs.map((output: any) => ({
      json: {
        success: true,
        data: output,
      },
    }));
  } catch (error) {
    const errorData = {
      success: false,
      error: {
        message: error.message,
        details: 'Error retrieving AI app outputs',
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

    return [{ json: errorData }];
  }
}
