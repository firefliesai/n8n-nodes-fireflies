import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { callGraphQLApi } from '../../transport';
import { getActiveMeetingsQuery, handleOperationError } from '../../helpers';

export async function getActiveMeetings(
  ef: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  try {
    const filters = ef.getNodeParameter('filters', index, {}) as {
      email?: string;
      states?: string[];
    };
    const input: Record<string, unknown> = {};
    if (filters.email) input.email = filters.email;
    if (filters.states?.length) input.states = filters.states;

    const response = await callGraphQLApi.call(ef, getActiveMeetingsQuery, { input });

    return (response.active_meetings ?? []).map((meeting: Record<string, any>) => ({
      json: {
        success: true,
        data: meeting,
      },
    }));
  } catch (error) {
    const errorResponse = handleOperationError(
      ef.getNode(),
      error,
      ef.continueOnFail(),
      'getActiveMeetings',
    );

    return [{ json: errorResponse }];
  }
}
