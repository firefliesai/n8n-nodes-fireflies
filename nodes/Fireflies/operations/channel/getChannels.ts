import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { callGraphQLApi } from '../../transport';
import { getChannelsQuery, handleOperationError } from '../../helpers';

export async function getChannels(ef: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
  try {
    const response = await callGraphQLApi.call(ef, getChannelsQuery, {});

    return (response.channels ?? []).map((channel: Record<string, any>) => ({
      json: {
        success: true,
        data: channel,
      },
    }));
  } catch (error) {
    const errorResponse = handleOperationError(
      ef.getNode(),
      error,
      ef.continueOnFail(),
      'getChannels'
    );

    return [{ json: errorResponse }];
  }
}
