import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { callGraphQLApi } from '../../transport';
import { createAskFredThreadMutation, handleOperationError } from '../../helpers';

export async function createThread(ef: IExecuteFunctions, index: number): Promise<INodeExecutionData> {
  try {
    const query = ef.getNodeParameter('query', index) as string;
    const transcriptId = ef.getNodeParameter('transcriptId', index, '') as string;
    const additionalFields = ef.getNodeParameter('additionalFields', index, {}) as {
      formatMode?: string;
      responseLanguage?: string;
    };
    const filters = ef.getNodeParameter('filters', index, {}) as {
      fromDate?: string;
      toDate?: string;
      keyword?: string;
      title?: string;
      organizers?: string;
      participants?: string;
      limit?: number;
    };

    const input: Record<string, any> = {
      query,
    };

    // Add transcript_id if provided
    if (transcriptId) {
      input.transcript_id = transcriptId;
    }

    // Add additional fields
    if (additionalFields.formatMode) {
      input.format_mode = additionalFields.formatMode;
    }
    if (additionalFields.responseLanguage) {
      input.response_language = additionalFields.responseLanguage;
    }

    // Build filters object if any filters are provided
    const hasFilters = Object.keys(filters).some(key => {
      const value = filters[key as keyof typeof filters];
      return value !== undefined && value !== '' && value !== null;
    });

    if (hasFilters && !transcriptId) {
      const filtersInput: Record<string, any> = {};

      if (filters.fromDate) {
        filtersInput.start_time = filters.fromDate;
      }
      if (filters.toDate) {
        filtersInput.end_time = filters.toDate;
      }
      if (filters.organizers) {
        filtersInput.organizers = filters.organizers.split(',').map(e => e.trim()).filter(e => e);
      }
      if (filters.participants) {
        filtersInput.participants = filters.participants.split(',').map(e => e.trim()).filter(e => e);
      }

      if (Object.keys(filtersInput).length > 0) {
        input.filters = filtersInput;
      }
    }

    const response = await callGraphQLApi.call(ef, createAskFredThreadMutation, { input });

    return {
      json: {
        success: true,
        data: response.createAskFredThread,
      },
    };
  } catch (error) {
    const errorResponse = handleOperationError(
      ef.getNode(),
      error,
      ef.continueOnFail(),
      'createThread'
    );

    return {
      json: errorResponse,
    };
  }
}
