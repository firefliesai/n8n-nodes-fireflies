import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { callGraphQLApi } from '../../transport';
import { getTranscriptsListQuery } from '../../helpers';
import { handleOperationError } from '../../helpers';

export async function getTranscriptsList(ef: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
  try {
    const limit = ef.getNodeParameter('limit', index, 50) as number;
    const skip = ef.getNodeParameter('skip', index, 0) as number;

    const filters = ef.getNodeParameter('filters', index, {}) as {
      title?: string;
      date?: number;
      fromDate?: string;
      toDate?: string;
      hostEmail?: string;
      organizerEmail?: string;
      participantEmail?: string;
      userId?: string;
      mine?: boolean;
    };

    const variables: Record<string, any> = {
      limit,
      skip,
    };

    if (filters.title) variables.title = filters.title;
    if (filters.date !== undefined) variables.date = filters.date;
    if (filters.fromDate) variables.fromDate = filters.fromDate;
    if (filters.toDate) variables.toDate = filters.toDate;
    if (filters.hostEmail) variables.hostEmail = filters.hostEmail;
    if (filters.organizerEmail) variables.organizerEmail = filters.organizerEmail;
    if (filters.participantEmail) variables.participantEmail = filters.participantEmail;
    if (filters.userId) variables.userId = filters.userId;
    if (filters.mine !== undefined) variables.mine = filters.mine;

    const response = await callGraphQLApi.call(ef, getTranscriptsListQuery, variables);

    return response.transcripts.map((transcript: any) => ({
      json: {
        success: true,
        data: transcript,
      },
    }));
  } catch (error) {
    const errorResponse = handleOperationError(
      ef.getNode(),
      error,
      ef.continueOnFail(),
      'getTranscriptsList'
    );

    return [{ json: errorResponse }];
  }
}
