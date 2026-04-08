import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import PatientFilters from '@/components/patients/patient-filters';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type PatientListItem = {
    id: number;
    name: string;
    species: string;
    status: string;
    user?: {
        name: string;
    } | null;
};

type PaginatedPatients = {
    data: PatientListItem[];
};

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Patients',
        href: '/patients',
    },
];

export default function PatientsIndex({
    patients,
    filters,
}: {
    patients: PaginatedPatients;
    filters: {
        search: string;
        status: string;
    };
}) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? '');

    const applyFilters = () => {
        router.get(
            '/patients',
            { search, status },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const resetFilters = () => {
        setSearch('');
        setStatus('');
        router.get('/patients', {}, { preserveState: true, replace: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Patients" />
            <div className="space-y-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Patients</h1>
                    <Button asChild>
                        <Link href="/patients/create">Add patient</Link>
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

                <div className="overflow-hidden rounded-lg border">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-muted/30">
                            <tr>
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Species</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Owner</th>
                                <th className="px-4 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patients.data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-4 py-8 text-center text-muted-foreground"
                                    >
                                        No patients found.
                                    </td>
                                </tr>
                            ) : (
                                patients.data.map((patient) => (
                                    <tr key={patient.id} className="border-t">
                                        <td className="px-4 py-3 font-medium">
                                            {patient.name}
                                        </td>
                                        <td className="px-4 py-3">
                                            {patient.species}
                                        </td>
                                        <td className="px-4 py-3">
                                            {patient.status}
                                        </td>
                                        <td className="px-4 py-3">
                                            {patient.user?.name ?? '-'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <Link
                                                href={`/patients/${patient.id}`}
                                                className="text-sm underline"
                                            >
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
