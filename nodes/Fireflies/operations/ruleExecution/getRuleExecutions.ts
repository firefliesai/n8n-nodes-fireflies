import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { getRuleExecutionsByMeetingQuery, handleOperationError } from '../../helpers';
import { fetchCursorPages } from '../cursorPagination';

export async function getRuleExecutions(
  ef: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  try {
    const returnAll = ef.getNodeParameter('returnAll', index, false) as boolean;
    const filters = ef.getNodeParameter('filters', index, {}) as {
      rule_id?: string;
      meeting_id?: string;
      date_from?: string;
      date_to?: string;
      is_test?: string;
      logs_per_meeting?: number;
      cursor?: string;
    };
    const limit = returnAll ? undefined : (ef.getNodeParameter('limit', index, 50) as number);

    const apiFilters: Record<string, unknown> = {};
    for (const key of ['rule_id', 'meeting_id', 'date_from', 'date_to'] as const) {
      if (filters[key]) apiFilters[key] = filters[key];
    }
    // 'any' leaves is_test out so the API returns test and production logs alike.
    if (filters.is_test === 'true' || filters.is_test === 'false') {
      apiFilters.is_test = filters.is_test === 'true';
    }

    const variables: Record<string, unknown> = {};
    if (Object.keys(apiFilters).length) variables.filters = apiFilters;
    if (filters.logs_per_meeting) variables.logsPerMeeting = filters.logs_per_meeting;
    if (filters.cursor) variables.cursor = filters.cursor;

    const page = await fetchCursorPages<IDataObject>(
      ef,
      getRuleExecutionsByMeetingQuery,
      variables,
      (data) => ({
        items: data.rule_executions_by_meeting?.meetings ?? [],
        has_more: Boolean(data.rule_executions_by_meeting?.has_more),
        next_cursor: data.rule_executions_by_meeting?.next_cursor ?? null,
      }),
      { returnAll, limit },
    );

    return page.items.map((meetingGroup) => ({
      json: {
        success: true,
        data: meetingGroup,
        page: {
          has_more: page.has_more,
          next_cursor: page.next_cursor,
          ...(page.truncated && { truncated: true }),
          ...(page.stalled && { stalled: true }),
        },
      },
    }));
  } catch (error) {
    return [
      {
        json: handleOperationError(ef.getNode(), error, ef.continueOnFail(), 'getRuleExecutions'),
      },
    ];
  }
}
