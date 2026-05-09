import { Inbox } from 'lucide-react';
import type { ReactNode } from 'react';
import { useCallback, useMemo, useState } from 'react';

import { LIST_PAGE_SIZE_OPTIONS } from '@/lib/list-query';
import { cn } from '@/lib/utils';

export type Column<T> = {
    key: string;
    header: string;
    render: (row: T) => ReactNode;
    className?: string;
};

export type DataTableServerPagination = {
    totalCount: number;
    currentPage: number;
    lastPage: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange?: (pageSize: number) => void;
};

type Props<T> = {
    columns: Column<T>[];
    rows: T[];
    rowKey: (row: T) => string | number;
    /** Shown above the table (e.g. filters or search). Rendered even when there are no rows. */
    toolbar?: ReactNode;
    empty?: ReactNode;
    emptyMessage?: string;
    /** Client mode: initial rows per page (default 10). Ignored when `serverPagination` is set. */
    defaultPageSize?: number;
    pageSizeOptions?: readonly number[];
    showPageSizeSelector?: boolean;
    showRecordCount?: boolean;
    serverPagination?: DataTableServerPagination;
    className?: string;
};

export function computeShouldPaginate(totalRows: number, pageSize: number): boolean {
    return totalRows > pageSize;
}

function TableShell({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <div
            className={cn(
                'border-border bg-card text-card-foreground overflow-hidden rounded-2xl border shadow-sm transition duration-200 ease-in-out',
                className,
            )}
        >
            {children}
        </div>
    );
}

export function DataTable<T>({
    columns,
    rows,
    rowKey,
    toolbar,
    empty,
    emptyMessage = 'No data available',
    defaultPageSize = 10,
    pageSizeOptions = LIST_PAGE_SIZE_OPTIONS,
    showPageSizeSelector = true,
    showRecordCount = true,
    serverPagination,
    className,
}: Props<T>) {
    const isServer = serverPagination !== undefined;

    const [clientPageSize, setClientPageSize] = useState(() => {
        const initial = defaultPageSize;

        if (pageSizeOptions.includes(initial)) {
            return initial;
        }

        return pageSizeOptions[0] ?? 10;
    });

    const [clientPage, setClientPage] = useState(1);

    const pageSize = isServer ? serverPagination.pageSize : clientPageSize;

    const total = isServer ? serverPagination.totalCount : rows.length;

    const shouldPaginate = total > 0 && computeShouldPaginate(total, pageSize);

    const lastPage = isServer
        ? Math.max(1, serverPagination.lastPage)
        : Math.max(1, Math.ceil(total / pageSize));

    const safeClientPage = Math.min(Math.max(1, clientPage), lastPage);

    const currentPage = isServer ? serverPagination.currentPage : safeClientPage;

    const displayRows = useMemo(() => {
        if (isServer) {
            return rows;
        }

        if (!shouldPaginate) {
            return rows;
        }

        const start = (safeClientPage - 1) * pageSize;

        return rows.slice(start, start + pageSize);
    }, [isServer, rows, shouldPaginate, safeClientPage, pageSize]);

    const onClientPageSizeChange = useCallback(
        (next: number) => {
            if (!pageSizeOptions.includes(next)) {
                return;
            }

            setClientPageSize(next);
            setClientPage(1);
        },
        [pageSizeOptions],
    );

    const rangeStart = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;

    const rangeEnd = total === 0 ? 0 : Math.min(currentPage * pageSize, total);

    const showPageSizeControl =
        showPageSizeSelector &&
        total > 0 &&
        (shouldPaginate ||
            (isServer && serverPagination.onPageSizeChange !== undefined));

    if (total === 0) {
        return (
            <TableShell className={className}>
                {toolbar ? (
                    <div className="border-border bg-muted/15 border-b px-4 py-3">
                        {toolbar}
                    </div>
                ) : null}
                <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
                    <div
                        className="border-border bg-muted/40 text-muted-foreground flex size-14 items-center justify-center rounded-2xl border border-dashed"
                        aria-hidden
                    >
                        <Inbox className="size-7" strokeWidth={1.5} />
                    </div>
                    <div className="max-w-sm space-y-1">
                        <p className="text-foreground text-sm font-medium">
                            Nothing to show yet
                        </p>
                        <div className="text-muted-foreground text-sm">
                            {empty ?? emptyMessage}
                        </div>
                    </div>
                </div>
            </TableShell>
        );
    }

    const footer = (
        <div className="border-border bg-muted/20 text-muted-foreground flex min-h-[52px] flex-wrap items-center justify-between gap-3 border-t px-4 py-3 text-sm">
            {showRecordCount ? (
                <div className="flex min-w-0 flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-2">
                    <span className="text-foreground font-medium tabular-nums">
                        {total === 1 ? '1 record' : `${total} records`}
                    </span>
                    {shouldPaginate ? (
                        <span className="tabular-nums">
                            Showing {rangeStart}–{rangeEnd} of {total}
                        </span>
                    ) : null}
                </div>
            ) : (
                <span className="min-w-[1px]" aria-hidden />
            )}
            <div className="flex flex-wrap items-center justify-end gap-3">
                {showPageSizeControl ? (
                    <label className="text-foreground flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground whitespace-nowrap">
                            Rows per page
                        </span>
                        <select
                            className="border-border bg-background text-foreground focus-visible:ring-ring rounded-md border px-2 py-1.5 text-sm focus-visible:ring-2 focus-visible:outline-none"
                            value={pageSize}
                            aria-label="Rows per page"
                            onChange={(e) => {
                                const next = Number.parseInt(e.target.value, 10);

                                if (isServer) {
                                    serverPagination.onPageSizeChange?.(next);

                                    return;
                                }

                                onClientPageSizeChange(next);
                            }}
                        >
                            {pageSizeOptions.map((opt) => (
                                <option key={opt} value={opt}>
                                    {opt}
                                </option>
                            ))}
                        </select>
                    </label>
                ) : null}
                {shouldPaginate ? (
                    <nav
                        className="flex items-center gap-2"
                        aria-label="Table pagination"
                    >
                        <button
                            type="button"
                            className="border-border text-foreground hover:bg-muted/80 rounded-lg border px-3 py-1.5 text-sm font-medium disabled:pointer-events-none disabled:opacity-70 disabled:text-muted-foreground"
                            disabled={currentPage <= 1}
                            aria-label="Previous page"
                            onClick={() => {
                                if (isServer) {
                                    serverPagination.onPageChange(currentPage - 1);

                                    return;
                                }

                                setClientPage(safeClientPage - 1);
                            }}
                        >
                            Previous
                        </button>
                        <span className="text-foreground tabular-nums px-1">
                            Page {currentPage} of {lastPage}
                        </span>
                        <button
                            type="button"
                            className="border-border text-foreground hover:bg-muted/80 rounded-lg border px-3 py-1.5 text-sm font-medium disabled:pointer-events-none disabled:opacity-70 disabled:text-muted-foreground"
                            disabled={currentPage >= lastPage}
                            aria-label="Next page"
                            onClick={() => {
                                if (isServer) {
                                    serverPagination.onPageChange(currentPage + 1);

                                    return;
                                }

                                setClientPage(safeClientPage + 1);
                            }}
                        >
                            Next
                        </button>
                    </nav>
                ) : null}
            </div>
        </div>
    );

    return (
        <TableShell className={className}>
            {toolbar ? (
                <div className="border-border bg-muted/15 border-b px-4 py-3">
                    {toolbar}
                </div>
            ) : null}
            <div className="overflow-x-auto">
                <table className="divide-border min-w-full divide-y text-left text-sm">
                    <thead className="bg-muted/45 text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                        <tr>
                            {columns.map((c) => (
                                <th
                                    key={c.key}
                                    scope="col"
                                    className={cn('px-4 py-3', c.className)}
                                >
                                    {c.header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-border divide-y">
                        {displayRows.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="text-muted-foreground px-4 py-10 text-center text-sm"
                                >
                                    No rows on this page.
                                </td>
                            </tr>
                        ) : (
                            displayRows.map((row) => (
                                <tr
                                    key={rowKey(row)}
                                    className="hover:bg-muted/45 transition-colors duration-200 ease-in-out"
                                >
                                    {columns.map((c) => (
                                        <td
                                            key={c.key}
                                            className={cn(
                                                'text-foreground px-4 py-3 whitespace-nowrap',
                                                c.className,
                                            )}
                                        >
                                            {c.render(row)}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {footer}
        </TableShell>
    );
}
