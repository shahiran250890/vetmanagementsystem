import { Head, Link, router, usePage } from '@inertiajs/react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import type { Column } from '@/components/data-table';
import { DataTable } from '@/components/data-table';
import { ListPageFilterActions } from '@/components/list-page-filter-actions';
import { ListPageFilters } from '@/components/list-page-filters';
import { LoadingSpinner } from '@/components/loading-spinner';
import { RoleGate } from '@/components/role-gate';
import type { SelectOption } from '@/components/select-dropdown';
import { SelectDropdown } from '@/components/select-dropdown';
import AppLayout from '@/layouts/app-layout';
import { parseListPerPage } from '@/lib/list-query';
import { billingService } from '@/services/billing-service';
import type { BreadcrumbItem } from '@/types';
import type { Bill } from '@/types/clinic-models';

const statusOpts: SelectOption[] = [
    { value: '', label: 'All' },
    { value: 'unpaid', label: 'Unpaid' },
    { value: 'paid', label: 'Paid' },
];

const breadcrumbs: BreadcrumbItem[] = [{ title: 'Bills', href: '/bills' }];

export default function BillsIndex() {
    const { url } = usePage();
    const { statusFromUrl, page, perPage } = useMemo(() => {
        const query = new URLSearchParams(url.split('?')[1] ?? '');

        return {
            statusFromUrl: query.get('status') ?? '',
            page: Number.parseInt(query.get('page') ?? '1', 10) || 1,
            perPage: parseListPerPage(query),
        };
    }, [url]);

    const [draftStatus, setDraftStatus] = useState(statusFromUrl);
    const [loading, setLoading] = useState(true);
    const [rows, setRows] = useState<Bill[]>([]);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 0,
    });

    const load = useCallback(async () => {
        setLoading(true);

        try {
            const res = await billingService.listBills({
                status: statusFromUrl,
                page,
                per_page: perPage,
            });
            setRows(res.items);
            setPagination(res.pagination);
        } finally {
            setLoading(false);
        }
    }, [statusFromUrl, page, perPage]);

    useEffect(() => {
        void load();
    }, [load]);

    useEffect(() => {
        setDraftStatus(statusFromUrl);
    }, [statusFromUrl]);

    const applyFilters = () => {
        router.get(
            '/bills',
            {
                ...(draftStatus ? { status: draftStatus } : {}),
                page: 1,
                per_page: perPage,
            },
            { preserveScroll: true },
        );
    };

    const resetFilters = () => {
        setDraftStatus('');
        router.get(
            '/bills',
            { page: 1, per_page: perPage },
            { preserveScroll: true },
        );
    };

    const columns: Column<Bill>[] = [
        {
            key: 'id',
            header: 'Bill #',
            render: (b) => <span className="font-mono text-sm">#{b.id}</span>,
        },
        {
            key: 'patient',
            header: 'Patient',
            render: (b) => b.patient?.name ?? `#${b.patient_id}`,
        },
        {
            key: 'amt',
            header: 'Total',
            render: (b) => (
                <span className="font-medium">
                    RM {Number.parseFloat(b.total_amount).toFixed(2)}
                </span>
            ),
        },
        {
            key: 'status',
            header: 'Status',
            render: (b) => <span className="capitalize">{b.status}</span>,
        },
        {
            key: 'a',
            header: '',
            className: 'text-right',
            render: (b) => (
                <Link
                    href={`/bills/${b.id}`}
                    className="text-sm font-medium text-primary hover:underline"
                >
                    Open
                </Link>
            ),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Bills" />
            <div className="space-y-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-semibold text-foreground">Bills</h1>
                        <p className="text-muted-foreground text-sm">Invoices and balances</p>
                    </div>
                    <RoleGate anyOf={['admin', 'superadmin', 'receptionist']}>
                        <Link
                            href="/bills/create"
                            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                        >
                            New bill
                        </Link>
                    </RoleGate>
                </div>
                <ListPageFilters>
                    <div className="grid w-full gap-4 md:grid-cols-[minmax(0,20rem)_auto] md:items-end">
                        <SelectDropdown
                            label="Status"
                            name="status"
                            options={statusOpts}
                            value={draftStatus}
                            onChange={(e) => setDraftStatus(e.target.value)}
                        />
                        <ListPageFilterActions
                            onApply={applyFilters}
                            onReset={resetFilters}
                        />
                    </div>
                </ListPageFilters>
                {loading ? (
                    <LoadingSpinner />
                ) : (
                    <DataTable
                        columns={columns}
                        rows={rows}
                        rowKey={(b) => b.id}
                        serverPagination={{
                            totalCount: pagination.total,
                            currentPage: pagination.current_page,
                            lastPage: pagination.last_page,
                            pageSize: pagination.per_page,
                            onPageChange: (next) => {
                                router.get(
                                    '/bills',
                                    {
                                        ...(statusFromUrl
                                            ? { status: statusFromUrl }
                                            : {}),
                                        page: next,
                                        per_page: perPage,
                                    },
                                    { preserveScroll: true },
                                );
                            },
                            onPageSizeChange: (next) => {
                                router.get(
                                    '/bills',
                                    {
                                        ...(statusFromUrl
                                            ? { status: statusFromUrl }
                                            : {}),
                                        page: 1,
                                        per_page: next,
                                    },
                                    { preserveScroll: true },
                                );
                            },
                        }}
                    />
                )}
            </div>
        </AppLayout>
    );
}
