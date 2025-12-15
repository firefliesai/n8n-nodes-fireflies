import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { callGraphQLApi } from '../../transport';
import { getAskFredThreadsQuery, handleOperationError } from '../../helpers';

export async function getThreads(ef: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
  try {
    const transcriptId = ef.getNodeParameter('transcriptId', index, '') as string;

    const variables: Record<string, any> = {};
    if (transcriptId) {
      variables.transcriptId = transcriptId;
    }

    const response = await callGraphQLApi.call(ef, getAskFredThreadsQuery, variables);

    const threads = response.askfred_threads || [];
    return threads.map((thread: any) => ({
      json: {
        success: true,
        data: thread,
      },
    }));
  } catch (error) {
    const errorResponse = handleOperationError(
      ef.getNode(),
      error,
      ef.continueOnFail(),
      'getThreads'
    );

    return [{ json: errorResponse }];
  }
}
