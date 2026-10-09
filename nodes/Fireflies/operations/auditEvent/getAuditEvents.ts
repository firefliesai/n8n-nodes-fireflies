import { IDataObject, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { getAuditEventsQuery, handleOperationError } from '../../helpers';
import { fetchCursorPages } from '../cursorPagination';

export async function getAuditEvents(
  ef: IExecuteFunctions,
  index: number,
): Promise<INodeExecutionData[]> {
  try {
    const category = ef.getNodeParameter('category', index) as string;
    const returnAll = ef.getNodeParameter('returnAll', index, false) as boolean;
    const filters = ef.getNodeParameter('filters', index, {}) as {
      action?: string;
      date_from?: string;
      date_to?: string;
      actor_user_id?: string;
      actor_email?: string;
      cursor?: string;
    };
    // The API caps a page at 50.
    const limit = returnAll ? 50 : Math.min(50, ef.getNodeParameter('limit', index, 50) as number);

    const apiFilters: Record<string, unknown> = { category };
    for (const key of ['action', 'date_from', 'date_to', 'actor_user_id', 'actor_email'] as const) {
      if (filters[key]) apiFilters[key] = filters[key];
    }

    const page = await fetchCursorPages<IDataObject>(
      ef,
      getAuditEventsQuery,
      { limit, filters: apiFilters, ...(filters.cursor && { cursor: filters.cursor }) },
      (data) => ({
        items: data.auditEvents?.events ?? [],
        has_more: Boolean(data.auditEvents?.has_more),
        next_cursor: data.auditEvents?.next_cursor ?? null,
      }),
      returnAll,
    );

    return page.items.map((event) => ({
      json: {
        success: true,
        data: event,
        page: { has_more: page.has_more, next_cursor: page.next_cursor },
      },
    }));
  } catch (error) {
    return [
      { json: handleOperationError(ef.getNode(), error, ef.continueOnFail(), 'getAuditEvents') },
    ];
  }
}
