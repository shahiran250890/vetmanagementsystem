import { Head, Link, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';

import type { Column } from '@/components/data-table';
import { DataTable } from '@/components/data-table';
import { PageHeader } from '@/components/page-header';
import PatientFilters from '@/components/patients/patient-filters';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { create, index as patientsIndex, show } from '@/routes/patients';
import type { BreadcrumbItem, PaginatedCollection, PatientRecord } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Patients',
        href: patientsIndex(),
    },
];

function validatedPerPage(value: number | undefined): number {
    if (value === 10 || value === 25 || value === 50) {
        return value;
    }

    return 10;
}

export default function PatientsIndex({
    patients,
    filters,
}: {
    patients: PaginatedCollection<PatientRecord>;
    filters: {
        search: string;
        status: string;
        per_page?: number;
    };
}) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? '');

    const perPage = useMemo(
        () => validatedPerPage(filters.per_page),
        [filters.per_page],
    );

    const listQuery = useMemo(
        () => ({
            ...(filters.search !== '' ? { search: filters.search } : {}),
            ...(filters.status !== '' ? { status: filters.status } : {}),
            ...(perPage !== 10 ? { per_page: perPage } : {}),
        }),
        [filters.search, filters.status, perPage],
    );

    const applyFilters = () => {
        router.get(
            patientsIndex.url(),
            {
                ...(search ? { search } : {}),
                ...(status ? { status } : {}),
                page: 1,
                ...(perPage !== 10 ? { per_page: perPage } : {}),
            },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const resetFilters = () => {
        setSearch('');
        setStatus('');
        router.get(patientsIndex.url(), {}, { preserveState: true, replace: true });
    };

    const columns: Column<PatientRecord>[] = useMemo(
        () => [
            {
                key: 'name',
                header: 'Name',
                render: (patient) => (
                    <span className="text-foreground font-medium">{patient.name}</span>
                ),
            },
            {
                key: 'type',
                header: 'Type',
                render: (patient) => patient.patient_type,
            },
            {
                key: 'species',
                header: 'Species',
                render: (patient) => patient.species ?? '—',
            },
            {
                key: 'status',
                header: 'Status',
                render: (patient) => patient.status,
            },
            {
                key: 'contact',
                header: 'Contact',
                render: (patient) =>
                    patient.patient_type === 'animal'
                        ? (patient.user?.name ?? '—')
                        : (patient.human_profile?.primary_phone ?? '—'),
            },
            {
                key: 'actions',
                header: 'Action',
                className: 'text-right',
                render: (patient) => {
                    return (
                        <div className="flex items-center justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled
                                className="gap-1.5"
                            >
                                Call-up
                                <Badge
                                    variant="secondary"
                                    className="shrink-0 px-1.5 py-0 text-[10px] font-normal"
                                >
                                    Soon
                                </Badge>
                            </Button>
                            <Button asChild size="sm">
                                <Link href={show(patient.id)}>View</Link>
                            </Button>
                        </div>
                    );
                },
            },
        ],
        [],
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Patients" />
            <div className="space-y-6">
                <PageHeader
                    breadcrumbs={breadcrumbs}
                    title="Patients"
                    description="Search and manage patient records."
                    actions={
                        <Button asChild>
                            <Link href={create()}>Register patient</Link>
                        </Button>
                    }
                />

                <DataTable
                    columns={columns}
                    rows={patients.data}
                    rowKey={(patient) => patient.id}
                    emptyMessage="No patients found."
                    toolbar={
                        <PatientFilters
                            search={search}
                            status={status}
                            onSearchChange={setSearch}
                            onStatusChange={setStatus}
                            onApply={applyFilters}
                            onReset={resetFilters}
                        />
                    }
                    serverPagination={{
                        totalCount: patients.total,
                        currentPage: patients.current_page,
                        lastPage: patients.last_page,
                        pageSize: patients.per_page ?? perPage,
                        onPageChange: (page) => {
                            router.get(
                                patientsIndex.url(),
                                { ...listQuery, page },
                                {
                                    preserveState: true,
                                    preserveScroll: true,
                                    replace: true,
                                },
                            );
                        },
                        onPageSizeChange: (next) => {
                            router.get(
                                patientsIndex.url(),
                                {
                                    ...listQuery,
                                    page: 1,
                                    per_page: next,
                                },
                                {
                                    preserveState: true,
                                    preserveScroll: true,
                                    replace: true,
                                },
                            );
                        },
                    }}
                />
            </div>
        </AppLayout>
    );
}
