import { IExecuteFunctions } from 'n8n-workflow';
import { callGraphQLApi } from '../transport';

export interface CursorPage<T> {
  items: T[];
  has_more: boolean;
  next_cursor: string | null;
}

/** Upper bound on pages fetched by one Return All, so a cursor the API never ends cannot loop forever. */
export const MAX_PAGES = 200;

/**
 * Fetch one page, or every page when `returnAll`, of a cursor-paginated query.
 * Each page is a separate request through `callGraphQLApi`, so it gets the
 * same rate-limit handling as any other call.
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
    const data = await callGraphQLApi.call(ef, query, {
      ...variables,
      ...(cursor && { cursor }),
    });
    const result = readPage(data);
    items.push(...result.items);
    if (!returnAll || !result.has_more || !result.next_cursor) {
      return { items, has_more: result.has_more, next_cursor: result.next_cursor };
    }
    cursor = result.next_cursor;
  }
  return { items, has_more: true, next_cursor: cursor ?? null };
}
