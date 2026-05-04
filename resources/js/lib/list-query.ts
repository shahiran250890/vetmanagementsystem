export const LIST_PAGE_SIZE_OPTIONS = [10, 25, 50] as const;

export type ListPageSize = (typeof LIST_PAGE_SIZE_OPTIONS)[number];

export function parseListPerPage(params: URLSearchParams): ListPageSize {
    const raw = Number.parseInt(params.get('per_page') ?? '10', 10);

    if (LIST_PAGE_SIZE_OPTIONS.includes(raw as ListPageSize)) {
        return raw as ListPageSize;
    }

    return 10;
}
