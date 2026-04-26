import { Head, Link, useForm } from '@inertiajs/react';
import PatientForm from '@/components/patients/patient-form';
import AppLayout from '@/layouts/app-layout';
import { edit, index, show, update } from '@/routes/patients';
import type { FormEvent } from 'react';
import type { BreadcrumbItem } from '@/types';
import type {
    AllowedPatientType,
    BloodTypeOption,
    OwnerOption,
    PatientFormData,
    PatientRecord,
    SpeciesOption,
} from '@/types/patient';

export default function EditPatient({
    patient,
    owners,
    bloodTypes,
    speciesOptions,
    allowedPatientType,
}: {
    patient: PatientRecord;
    owners: OwnerOption[];
    bloodTypes: BloodTypeOption[];
    speciesOptions: SpeciesOption[];
    allowedPatientType: AllowedPatientType;
}) {
    const normalizedSex = (() => {
        if (patient.sex === 'Male' || patient.sex === 'male') {
            return '1';
        }

        if (patient.sex === 'Female' || patient.sex === 'female') {
            return '2';
        }

        if (patient.sex === '1' || patient.sex === '2') {
            return patient.sex;
        }

        return '';
    })();

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Patients', href: index() },
        { title: patient.name, href: show(patient.id) },
        { title: 'Edit', href: edit(patient.id) },
    ];

    const { data, setData, put, processing, errors } = useForm<PatientFormData>({
        patient_type: allowedPatientType ?? patient.patient_type,
        name: patient.name,
        sex: normalizedSex,
        date_of_birth: patient.date_of_birth ?? '',
        emergency_contact_name: patient.emergency_contact_name ?? '',
        emergency_contact_phone: patient.emergency_contact_phone ?? '',
        allergies: patient.allergies ?? '',
        current_medications: patient.current_medications ?? '',
        status: patient.status,
        notes: patient.notes ?? '',
        animal_profile: {
            owner_user_id: patient.animal_profile?.owner_user_id
                ? String(patient.animal_profile.owner_user_id)
                : '',
            species: patient.animal_profile?.species ?? patient.species ?? '',
            breed: patient.animal_profile?.breed ?? patient.breed ?? '',
            color: patient.animal_profile?.color ?? patient.color ?? '',
            microchip_number:
                patient.animal_profile?.microchip_number ??
                patient.microchip_number ??
                '',
            latest_weight_kg:
                patient.animal_profile?.latest_weight_kg ??
                patient.latest_weight_kg ??
                '',
            vaccination_status:
                patient.animal_profile?.vaccination_status ??
                patient.vaccination_status ??
                '',
        },
        human_profile: {
            identification_number:
                patient.human_profile?.identification_number ?? '',
            blood_type_id: patient.human_profile?.blood_type_id
                ? String(patient.human_profile.blood_type_id)
                : '',
            primary_phone: patient.human_profile?.primary_phone ?? '',
            address: patient.human_profile?.address ?? '',
            height_cm: patient.human_profile?.height_cm ?? '',
            weight_kg: patient.human_profile?.weight_kg ?? '',
            blood_pressure: patient.human_profile?.blood_pressure ?? '',
            vital_medical_information:
                patient.human_profile?.vital_medical_information ?? '',
        },
    });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        put(update.url(patient.id));
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
            <Head title={`Edit ${patient.name}`} />
            <div className="space-y-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Edit patient</h1>
                    <Link href={show(patient.id)} className="text-sm underline">
                        Back to patient
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
                        submitLabel="Update patient"
                        allowedPatientType={allowedPatientType}
                    />
                </form>
            </div>
        </AppLayout>
    );
}
