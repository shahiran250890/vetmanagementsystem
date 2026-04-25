import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
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

export default function PatientsIndex({
    patients,
    filters,
}: {
    patients: PaginatedCollection<PatientRecord>;
    filters: {
        search: string;
        status: string;
    };
}) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? '');

    const applyFilters = () => {
        router.get(
            patientsIndex.url(),
            { search, status },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const resetFilters = () => {
        setSearch('');
        setStatus('');
        router.get(patientsIndex.url(), {}, { preserveState: true, replace: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Patients" />
            <div className="space-y-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Patients</h1>
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

                <div className="overflow-hidden rounded-lg border">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-muted/30">
                            <tr>
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Type</th>
                                <th className="px-4 py-3">Species</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Contact</th>
                                <th className="px-4 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patients.data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
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
                                            {patient.patient_type}
                                        </td>
                                        <td className="px-4 py-3">
                                            {patient.species}
                                        </td>
                                        <td className="px-4 py-3">
                                            {patient.status}
                                        </td>
                                        <td className="px-4 py-3">
                                            {patient.patient_type === 'animal'
                                                ? patient.user?.name ?? '-'
                                                : patient.human_profile?.primary_phone ?? '-'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <Link
                                                href={show(patient.id)}
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
