import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { callGraphQLApi } from '../../transport';
import { getChannelQuery, handleOperationError } from '../../helpers';

export async function getChannel(ef: IExecuteFunctions, index: number): Promise<INodeExecutionData> {
  try {
    const channelId = ef.getNodeParameter('channelId', index) as string;

    const response = await callGraphQLApi.call(ef, getChannelQuery, { id: channelId });

    return {
      json: {
        success: true,
        data: response.channel,
      },
    };
  } catch (error) {
    const errorResponse = handleOperationError(
      ef.getNode(),
      error,
      ef.continueOnFail(),
      'getChannel'
    );

    return {
      json: errorResponse,
    };
  }
}
