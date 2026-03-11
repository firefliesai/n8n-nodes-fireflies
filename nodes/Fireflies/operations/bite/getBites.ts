import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { callGraphQLApi } from '../../transport';
import { getBitesQuery, handleOperationError } from '../../helpers';

export async function getBites(ef: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
  try {
    const limit = ef.getNodeParameter('limit', index, undefined) as number | undefined;
    const skip = ef.getNodeParameter('skip', index, undefined) as number | undefined;

    const additionalFields = ef.getNodeParameter('additionalFields', index, {}) as {
      mine?: boolean;
      transcriptId?: string;
      myTeam?: boolean;
    };

    const variables: Record<string, any> = {
      ...(limit !== undefined && { limit }),
      ...(skip !== undefined && { skip }),
      ...(additionalFields.mine !== undefined && { mine: additionalFields.mine }),
      ...(additionalFields.transcriptId && { transcriptId: additionalFields.transcriptId }),
      ...(additionalFields.myTeam !== undefined && { myTeam: additionalFields.myTeam }),
    };

    const response = await callGraphQLApi.call(ef, getBitesQuery, variables);

    return response.bites.map((bite: Record<string, any>) => ({
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
