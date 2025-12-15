import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { callGraphQLApi } from '../../transport';
import { createAskFredThreadMutation, handleOperationError } from '../../helpers';

export async function createThread(ef: IExecuteFunctions, index: number): Promise<INodeExecutionData> {
  try {
    const query = ef.getNodeParameter('query', index) as string;

    const additionalFields = ef.getNodeParameter('additionalFields', index, {}) as {
      transcriptId?: string;
      responseLanguage?: string;
      formatMode?: string;
    };

    const meetingFilters = ef.getNodeParameter('meetingFilters', index, {}) as {
      startTime?: string;
      endTime?: string;
      channelIds?: string;
      organizers?: string;
      participants?: string;
      transcriptIds?: string;
    };

    const input: Record<string, any> = {
      query,
    };

    if (additionalFields.transcriptId) {
      input.transcript_id = additionalFields.transcriptId;
    }

    if (additionalFields.responseLanguage) {
      input.response_language = additionalFields.responseLanguage;
    }

    if (additionalFields.formatMode) {
      input.format_mode = additionalFields.formatMode;
    }

    // Build filters object if any filter is provided
    const hasFilters = meetingFilters.startTime || meetingFilters.endTime ||
      meetingFilters.channelIds || meetingFilters.organizers ||
      meetingFilters.participants || meetingFilters.transcriptIds;

    if (hasFilters) {
      const filters: Record<string, any> = {};

      if (meetingFilters.startTime) {
        filters.start_time = meetingFilters.startTime;
      }

      if (meetingFilters.endTime) {
        filters.end_time = meetingFilters.endTime;
      }

      if (meetingFilters.channelIds) {
        filters.channel_ids = meetingFilters.channelIds.split(',').map(id => id.trim()).filter(id => id);
      }

      if (meetingFilters.organizers) {
        filters.organizers = meetingFilters.organizers.split(',').map(email => email.trim()).filter(email => email);
      }

      if (meetingFilters.participants) {
        filters.participants = meetingFilters.participants.split(',').map(email => email.trim()).filter(email => email);
      }

      if (meetingFilters.transcriptIds) {
        filters.transcript_ids = meetingFilters.transcriptIds.split(',').map(id => id.trim()).filter(id => id);
      }

      input.filters = filters;
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
