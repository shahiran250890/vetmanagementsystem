import { Head, Link, useForm } from '@inertiajs/react';
import PatientForm from '@/components/patients/patient-form';
import AppLayout from '@/layouts/app-layout';
import { create, index, store } from '@/routes/patients';
import type { FormEvent } from 'react';
import type { BreadcrumbItem } from '@/types';
import type {
    AllowedPatientType,
    BloodTypeOption,
    OwnerOption,
    PatientFormData,
    SpeciesOption,
} from '@/types/patient';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Patients', href: index() },
    { title: 'Create', href: create() },
];

export default function CreatePatient({
    owners,
    bloodTypes,
    speciesOptions,
    allowedPatientType,
}: {
    owners: OwnerOption[];
    bloodTypes: BloodTypeOption[];
    speciesOptions: SpeciesOption[];
    allowedPatientType: AllowedPatientType;
}) {
    const { data, setData, post, processing, errors } = useForm<PatientFormData>({
        patient_type: allowedPatientType ?? 'animal',
        name: '',
        sex: '',
        date_of_birth: '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        allergies: '',
        current_medications: '',
        status: 'active',
        notes: '',
        animal_profile: {
            owner_user_id: '',
            species: '',
            breed: '',
            color: '',
            microchip_number: '',
            latest_weight_kg: '',
            vaccination_status: '',
        },
        human_profile: {
            identification_number: '',
            blood_type_id: '',
            primary_phone: '',
            address: '',
            height_cm: '',
            weight_kg: '',
            blood_pressure: '',
            vital_medical_information: '',
        },
    });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post(store.url());
    };

    const updateFormData = (key: string, value: string) => {
        if (key === 'patient_type') {
            setData({
                patient_type: value as PatientFormData['patient_type'],
                name: '',
                sex: '',
                date_of_birth: '',
                emergency_contact_name: '',
                emergency_contact_phone: '',
                allergies: '',
                current_medications: '',
                status: 'active',
                notes: '',
                animal_profile: {
                    owner_user_id: '',
                    species: '',
                    breed: '',
                    color: '',
                    microchip_number: '',
                    latest_weight_kg: '',
                    vaccination_status: '',
                },
                human_profile: {
                    identification_number: '',
                    blood_type_id: '',
                    primary_phone: '',
                    address: '',
                    height_cm: '',
                    weight_kg: '',
                    blood_pressure: '',
                    vital_medical_information: '',
                },
            });
            return;
        }

        if (!key.includes('.')) {
            setData(key as keyof PatientFormData, value as never);
            return;
        }

        const [section, field] = key.split('.') as [
            keyof Pick<PatientFormData, 'animal_profile' | 'human_profile'>,
            string,
        ];

        setData((current) => ({
            ...current,
            [section]: {
                ...current[section],
                [field]: value,
            },
        }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create patient" />
            <div className="space-y-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Create patient</h1>
                    <Link href={index()} className="text-sm underline">
                        Back to patients
                    </Link>
                </div>

                <form onSubmit={submit} className="rounded-lg border p-4">
                    <PatientForm
                        data={data}
                        setData={updateFormData}
                        errors={errors}
                        processing={processing}
                        owners={owners}
                        bloodTypes={bloodTypes}
                        speciesOptions={speciesOptions}
                        submitLabel="Create patient"
                        allowedPatientType={allowedPatientType}
                    />
                </form>
            </div>
        </AppLayout>
    );
}
