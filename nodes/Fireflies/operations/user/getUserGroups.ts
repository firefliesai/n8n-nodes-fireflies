import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { callGraphQLApi } from '../../transport';
import { getUserGroupsQuery, handleOperationError } from '../../helpers';

export async function getUserGroups(ef: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
  try {
    const additionalFields = ef.getNodeParameter('additionalFields', index, {}) as { mine?: boolean };
    const variables: Record<string, any> = {};
    if (additionalFields.mine !== undefined) variables.mine = additionalFields.mine;

    const response = await callGraphQLApi.call(ef, getUserGroupsQuery, variables);

    return (response.user_groups ?? []).map((group: Record<string, any>) => ({
      json: {
        success: true,
        data: group,
      },
    }));
  } catch (error) {
    const errorResponse = handleOperationError(
      ef.getNode(),
      error,
      ef.continueOnFail(),
      'getUserGroups'
    );

    return [{ json: errorResponse }];
  }
}
