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
import { appointmentService } from '@/services/appointment-service';
import type { BreadcrumbItem } from '@/types';
import type { Appointment } from '@/types/clinic-models';

const statusOptions: SelectOption[] = [
    { value: '', label: 'All statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
];

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Appointments', href: '/appointments' },
];

export default function AppointmentsIndex() {
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
    const [rows, setRows] = useState<Appointment[]>([]);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 0,
    });

    const load = useCallback(async () => {
        setLoading(true);

        try {
            const res = await appointmentService.list({
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
            '/appointments',
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
            '/appointments',
            { page: 1, per_page: perPage },
            { preserveScroll: true },
        );
    };

    const columns: Column<Appointment>[] = [
        {
            key: 'when',
            header: 'When',
            render: (a) => (
                <span className="text-foreground">
                    {a.appointment_datetime?.replace('T', ' ').slice(0, 16) ?? '—'}
                </span>
            ),
        },
        {
            key: 'patient',
            header: 'Patient',
            render: (a) => a.patient?.name ?? `#${a.patient_id}`,
        },
        {
            key: 'doctor',
            header: 'Doctor',
            render: (a) => a.doctor?.name ?? `#${a.doctor_id}`,
        },
        {
            key: 'type',
            header: 'Type',
            render: (a) => (
                <span className="capitalize">{a.type?.replace('_', ' ')}</span>
            ),
        },
        {
            key: 'status',
            header: 'Status',
            render: (a) => <span className="capitalize">{a.status}</span>,
        },
        {
            key: 'actions',
            header: '',
            className: 'text-right',
            render: (a) => (
                <Link
                    href={`/appointments/${a.id}/edit`}
                    className="text-sm font-medium text-primary hover:underline"
                >
                    Edit
                </Link>
            ),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Appointments" />
            <div className="space-y-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-semibold text-foreground">
                            Appointments
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            Manage visits and schedules
                        </p>
                    </div>
                    <RoleGate anyOf={['admin', 'superadmin', 'receptionist', 'doctor']}>
                        <Link
                            href="/appointments/create"
                            className="inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-95"
                        >
                            New appointment
                        </Link>
                    </RoleGate>
                </div>
                <ListPageFilters>
                    <div className="grid w-full gap-4 md:grid-cols-[minmax(0,20rem)_auto] md:items-end">
                        <SelectDropdown
                            label="Status"
                            name="status"
                            options={statusOptions}
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
                        rowKey={(a) => a.id}
                        serverPagination={{
                            totalCount: pagination.total,
                            currentPage: pagination.current_page,
                            lastPage: pagination.last_page,
                            pageSize: pagination.per_page,
                            onPageChange: (next) => {
                                router.get(
                                    '/appointments',
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
                                    '/appointments',
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
