import { Head, Link, router } from '@inertiajs/react';
import { useMemo, useState } from 'react';

import type { Column } from '@/components/data-table';
import { DataTable } from '@/components/data-table';
import PatientFilters from '@/components/patients/patient-filters';
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
                render: (patient) => (
                    <Link
                        href={show(patient.id)}
                        className="text-primary text-sm font-medium hover:underline"
                    >
                        View
                    </Link>
                ),
            },
        ],
        [],
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Patients" />
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-foreground text-xl font-semibold">Patients</h1>
                    <Button asChild>
                        <Link href={create()}>Add patient</Link>
                    </Button>
                </div>

                <PatientFilters
                    search={search}
                    status={status}
                    onSearchChange={setSearch}
                    onStatusChange={setStatus}
                    onApply={applyFilters}
                    onReset={resetFilters}
                />

                <DataTable
                    columns={columns}
                    rows={patients.data}
                    rowKey={(patient) => patient.id}
                    emptyMessage="No patients found."
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
