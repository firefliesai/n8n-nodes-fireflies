import { IExecuteFunctions, JsonValue } from 'n8n-workflow';
import { callGraphQLApi, FirefliesRateLimitError } from '../transport';

export interface CursorPage<T> {
  items: T[];
  has_more: boolean;
  next_cursor: string | null;
  /**
   * Return All stopped at MAX_PAGES while the API still had more. The items
   * are real, the set is incomplete: continue from `next_cursor`.
   */
  truncated?: boolean;
}

/** Upper bound on pages fetched by one Return All, so a cursor the API never ends cannot loop forever. */
export const MAX_PAGES = 200;

/**
 * Fetch one page, or every page when `returnAll`, of a cursor-paginated query.
 * Each page is a separate request through `callGraphQLApi`, so it gets the
 * same rate-limit handling as any other call.
 *
 * A rate limit on a later page does not discard the pages already fetched:
 * they ride on the error as partial progress (`completed`), with the cursor of
 * the refused page (`rejected`) to resume from.
 */
export async function fetchCursorPages<T>(
  ef: IExecuteFunctions,
  query: string,
  variables: Record<string, unknown>,
  readPage: (data: any) => CursorPage<T>,
  returnAll: boolean,
): Promise<CursorPage<T>> {
  const items: T[] = [];
  let cursor = variables.cursor as string | undefined;
  for (let page = 0; page < MAX_PAGES; page++) {
    let data: unknown;
    try {
      data = await callGraphQLApi.call(ef, query, {
        ...variables,
        ...(cursor && { cursor }),
      });
    } catch (error) {
      if (error instanceof FirefliesRateLimitError && items.length > 0) {
        throw error.withPartialProgress({
          completed: items as unknown as JsonValue[],
          rejected: [cursor ?? null],
          pending: [],
          summary:
            `Before the limit was reached, ${items.length} records were fetched over ${page} pages; ` +
            `continue from cursor ${cursor} (set it as the Cursor filter).`,
        });
      }
      throw error;
    }
    const result = readPage(data);
    items.push(...result.items);
    if (!returnAll || !result.has_more || !result.next_cursor) {
      return { items, has_more: result.has_more, next_cursor: result.next_cursor };
    }
    cursor = result.next_cursor;
  }
  return { items, has_more: true, next_cursor: cursor ?? null, truncated: true };
}
