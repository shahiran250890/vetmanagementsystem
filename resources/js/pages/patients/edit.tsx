import { Head, Link, useForm } from '@inertiajs/react';
import type { FormEvent } from 'react';
import PatientForm, {
    type PatientFormData,
} from '@/components/patients/patient-form';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

type OwnerOption = {
    id: number;
    name: string;
};

type Patient = {
    id: number;
    user_id: number | null;
    name: string;
    species: string;
    breed: string | null;
    sex: string | null;
    date_of_birth: string | null;
    color: string | null;
    microchip_number: string | null;
    emergency_contact_name: string | null;
    emergency_contact_phone: string | null;
    allergies: string | null;
    current_medications: string | null;
    latest_weight_kg: string | null;
    vaccination_status: string | null;
    status: string;
    notes: string | null;
};

export default function EditPatient({
    patient,
    owners,
}: {
    patient: Patient;
    owners: OwnerOption[];
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Patients', href: '/patients' },
        { title: patient.name, href: `/patients/${patient.id}` },
        { title: 'Edit', href: `/patients/${patient.id}/edit` },
    ];

    const { data, setData, put, processing, errors } = useForm<PatientFormData>({
        user_id: patient.user_id ? String(patient.user_id) : '',
        name: patient.name,
        species: patient.species,
        breed: patient.breed ?? '',
        sex: patient.sex ?? '',
        date_of_birth: patient.date_of_birth ?? '',
        color: patient.color ?? '',
        microchip_number: patient.microchip_number ?? '',
        emergency_contact_name: patient.emergency_contact_name ?? '',
        emergency_contact_phone: patient.emergency_contact_phone ?? '',
        allergies: patient.allergies ?? '',
        current_medications: patient.current_medications ?? '',
        latest_weight_kg: patient.latest_weight_kg ?? '',
        vaccination_status: patient.vaccination_status ?? '',
        status: patient.status,
        notes: patient.notes ?? '',
    });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        put(`/patients/${patient.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${patient.name}`} />
            <div className="space-y-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Edit patient</h1>
                    <Link href={`/patients/${patient.id}`} className="text-sm underline">
                        Back to patient
                    </Link>
                </div>

                <form onSubmit={submit} className="rounded-lg border p-4">
                    <PatientForm
                        data={data}
                        setData={setData}
                        errors={errors}
                        processing={processing}
                        owners={owners}
                        submitLabel="Update patient"
                    />
                </form>
            </div>
        </AppLayout>
    );
}
