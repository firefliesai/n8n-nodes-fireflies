import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { callGraphQLApi } from '../../transport';
import { getBiteQuery, handleOperationError } from '../../helpers';

export async function getBite(ef: IExecuteFunctions, index: number): Promise<INodeExecutionData> {
  try {
    const biteId = ef.getNodeParameter('biteId', index) as string;

    const response = await callGraphQLApi.call(ef, getBiteQuery, { id: biteId });

    return {
      json: {
        success: true,
        data: response.bite,
      },
    };
  } catch (error) {
    const errorResponse = handleOperationError(
      ef.getNode(),
      error,
      ef.continueOnFail(),
      'getBite'
    );

    return {
      json: errorResponse,
    };
  }
}
