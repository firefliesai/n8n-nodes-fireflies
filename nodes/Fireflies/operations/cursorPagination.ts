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
  /** The API repeated the cursor it was given; there is no cursor to resume from. */
  stalled?: boolean;
}

/** Largest page the API serves for the cursor-paginated queries. */
export const PAGE_SIZE = 50;

/** Upper bound on pages fetched by one Return All, so a cursor the API never ends cannot loop forever. */
export const MAX_PAGES = 200;

/**
 * Fetch a cursor-paginated query: every page when `returnAll`, otherwise as
 * many pages as it takes to collect `limit` results (n8n's meaning of Limit).
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
  /** Fetch every page (`returnAll`), or pages until `limit` results are collected. */
  { returnAll, limit }: { returnAll: boolean; limit?: number },
): Promise<CursorPage<T>> {
  const items: T[] = [];
  let cursor = variables.cursor as string | undefined;
  for (let page = 0; page < MAX_PAGES; page++) {
    let data: unknown;
    try {
      // The API caps a page at PAGE_SIZE; a Limit above it spans several pages.
      const remaining = returnAll ? PAGE_SIZE : Math.max(1, (limit ?? PAGE_SIZE) - items.length);
      data = await callGraphQLApi.call(ef, query, {
        ...variables,
        limit: Math.min(PAGE_SIZE, remaining),
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
    const limitReached = !returnAll && items.length >= (limit ?? PAGE_SIZE);
    if (limitReached || !result.has_more || !result.next_cursor) {
      return { items, has_more: result.has_more, next_cursor: result.next_cursor };
    }
    if (result.next_cursor === cursor) {
      // The API handed back the cursor it was given, so it offers no way past
      // this page: following it would re-fetch the same page until MAX_PAGES,
      // and publishing it would let a resumed run do the same. Keep what was
      // fetched, publish no cursor, and say why.
      return { items, has_more: true, next_cursor: null, truncated: true, stalled: true };
    }
    cursor = result.next_cursor;
  }
  return { items, has_more: true, next_cursor: cursor ?? null, truncated: true };
}
