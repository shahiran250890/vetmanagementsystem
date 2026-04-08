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

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Patients', href: '/patients' },
    { title: 'Create', href: '/patients/create' },
];

export default function CreatePatient({ owners }: { owners: OwnerOption[] }) {
    const { data, setData, post, processing, errors } = useForm<PatientFormData>({
        user_id: '',
        name: '',
        species: '',
        breed: '',
        sex: '',
        date_of_birth: '',
        color: '',
        microchip_number: '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        allergies: '',
        current_medications: '',
        latest_weight_kg: '',
        vaccination_status: '',
        status: 'active',
        notes: '',
    });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post('/patients');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create patient" />
            <div className="space-y-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Create patient</h1>
                    <Link href="/patients" className="text-sm underline">
                        Back to patients
                    </Link>
                </div>

                <form onSubmit={submit} className="rounded-lg border p-4">
                    <PatientForm
                        data={data}
                        setData={setData}
                        errors={errors}
                        processing={processing}
                        owners={owners}
                        submitLabel="Create patient"
                    />
                </form>
            </div>
        </AppLayout>
    );
}
