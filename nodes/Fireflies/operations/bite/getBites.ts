import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { callGraphQLApi } from '../../transport';
import { getBitesQuery, handleOperationError } from '../../helpers';

export async function getBites(ef: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
  try {
    const filterBy = ef.getNodeParameter('filterBy', index) as string;
    const limit = ef.getNodeParameter('limit', index, 10) as number;
    const skip = ef.getNodeParameter('skip', index, 0) as number;
    const variables: Record<string, any> = { limit, skip };

    if (filterBy === 'mine') {
      variables.mine = true;
    } else if (filterBy === 'myTeam') {
      variables.myTeam = true;
    } else if (filterBy === 'transcript') {
      const transcriptId = ef.getNodeParameter('transcriptId', index) as string;
      variables.transcriptId = transcriptId;
    }

    const response = await callGraphQLApi.call(ef, getBitesQuery, variables);
    return (response.bites ?? []).map((bite: Record<string, any>) => ({
      json: {
        success: true,
        data: bite,
      },
    }));
  } catch (error) {
    const errorResponse = handleOperationError(
      ef.getNode(),
      error,
      ef.continueOnFail(),
      'getBites'
    );
    return [{ json: errorResponse }];
  }
}
