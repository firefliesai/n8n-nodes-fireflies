import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { callGraphQLApi } from '../../transport';
import { getAIAppOutputsQuery } from '../../helpers';
import { handleOperationError } from '../../helpers';

export async function getAIAppOutputs(ef: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
  try {
    const appId = ef.getNodeParameter('appId', index) as string;
    const transcriptId = ef.getNodeParameter('transcriptId', index) as string;
    const skip = ef.getNodeParameter('skip', index, 0) as number;
    const limit = ef.getNodeParameter('limit', index, 50) as number;

    const variables: Record<string, any> = {
      appId,
      transcriptId,
      skip,
      limit,
    };

    const response = await callGraphQLApi.call(ef, getAIAppOutputsQuery, variables);

    return response.apps.outputs.map((output: any) => ({
      json: {
        success: true,
        data: output,
      },
    }));
  } catch (error) {
    const errorResponse = handleOperationError(
      ef.getNode(),
      error,
      ef.continueOnFail(),
      'getAIAppOutputs'
    );

    return [{ json: errorResponse }];
  }
}
