import { Head, Link, router, usePage } from '@inertiajs/react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import type { Column } from '@/components/data-table';
import { DataTable } from '@/components/data-table';
import { LoadingSpinner } from '@/components/loading-spinner';
import { RoleGate } from '@/components/role-gate';
import AppLayout from '@/layouts/app-layout';
import { parseListPerPage } from '@/lib/list-query';
import { medicalRecordService } from '@/services/medical-record-service';
import type { BreadcrumbItem } from '@/types';
import type { MedicalRecord } from '@/types/clinic-models';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Medical records', href: '/medical-records' },
];

export default function MedicalRecordsIndex() {
    const { url } = usePage();
    const { page, perPage } = useMemo(() => {
        const query = new URLSearchParams(url.split('?')[1] ?? '');

        return {
            page: Number.parseInt(query.get('page') ?? '1', 10) || 1,
            perPage: parseListPerPage(query),
        };
    }, [url]);

    const [loading, setLoading] = useState(true);
    const [rows, setRows] = useState<MedicalRecord[]>([]);
    const [pagination, setPagination] = useState({
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 0,
    });

    const load = useCallback(async () => {
        setLoading(true);

        try {
            const res = await medicalRecordService.list({ page, per_page: perPage });
            setRows(res.items);
            setPagination(res.pagination);
        } finally {
            setLoading(false);
        }
    }, [page, perPage]);

    useEffect(() => {
        void load();
    }, [load]);

    const columns: Column<MedicalRecord>[] = [
        {
            key: 'patient',
            header: 'Patient',
            render: (r) => r.patient?.name ?? `#${r.patient_id}`,
        },
        {
            key: 'doctor',
            header: 'Doctor',
            render: (r) => r.doctor?.name ?? `#${r.doctor_id}`,
        },
        {
            key: 'diagnosis',
            header: 'Diagnosis',
            render: (r) => (
                <span className="line-clamp-2 max-w-xs">{r.diagnosis ?? '—'}</span>
            ),
        },
        {
            key: 'actions',
            header: '',
            className: 'text-right',
            render: (r) => (
                <Link
                    href={`/medical-records/${r.id}`}
                    className="text-sm font-medium text-primary hover:underline"
                >
                    View
                </Link>
            ),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Medical records" />
            <div className="space-y-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-semibold text-foreground">
                            Medical records
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            Clinical documentation
                        </p>
                    </div>
                    <RoleGate anyOf={['admin', 'superadmin', 'receptionist', 'doctor']}>
                        <Link
                            href="/medical-records/create"
                            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                        >
                            New record
                        </Link>
                    </RoleGate>
                </div>
                {loading ? (
                    <LoadingSpinner />
                ) : (
                    <DataTable
                        columns={columns}
                        rows={rows}
                        rowKey={(r) => r.id}
                        serverPagination={{
                            totalCount: pagination.total,
                            currentPage: pagination.current_page,
                            lastPage: pagination.last_page,
                            pageSize: pagination.per_page,
                            onPageChange: (next) => {
                                router.get(
                                    '/medical-records',
                                    { page: next, per_page: perPage },
                                    { preserveScroll: true },
                                );
                            },
                            onPageSizeChange: (next) => {
                                router.get(
                                    '/medical-records',
                                    { page: 1, per_page: next },
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
