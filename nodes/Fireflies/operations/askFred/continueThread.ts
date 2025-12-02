import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { callGraphQLApi } from '../../transport';
import { continueAskFredThreadMutation, handleOperationError } from '../../helpers';

export async function continueThread(ef: IExecuteFunctions, index: number): Promise<INodeExecutionData> {
  try {
    const threadId = ef.getNodeParameter('threadId', index) as string;
    const query = ef.getNodeParameter('query', index) as string;
    const options = ef.getNodeParameter('options', index, {}) as {
      formatMode?: string;
      responseLanguage?: string;
    };

    const input: Record<string, any> = {
      thread_id: threadId,
      query,
    };

    // Add optional fields
    if (options.formatMode) {
      input.format_mode = options.formatMode;
    }
    if (options.responseLanguage) {
      input.response_language = options.responseLanguage;
    }

    const response = await callGraphQLApi.call(ef, continueAskFredThreadMutation, { input });

    return {
      json: {
        success: true,
        data: response.continueAskFredThread,
      },
    };
  } catch (error) {
    const errorResponse = handleOperationError(
      ef.getNode(),
      error,
      ef.continueOnFail(),
      'continueThread'
    );

    return {
      json: errorResponse,
    };
  }
}
