import { Head, useForm } from '@inertiajs/react';
import type { SubmitEventHandler } from 'react';
import { FormPageContent, formPageSurfaceClassName } from '@/components/form-page-layout';
import PatientForm from '@/components/patients/patient-form';
import { createPatientFormFieldHandler } from '@/hooks/use-patient-form-field-handler';
import AppLayout from '@/layouts/app-layout';
import { create, index, store } from '@/routes/patients';
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

    const submit: SubmitEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        post(store.url());
    };

    const updateFormData = createPatientFormFieldHandler(setData);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create patient" />
            <FormPageContent
                title="Create patient"
                backHref={index()}
                backLabel="Back to patients"
            >
                <form onSubmit={submit} className={formPageSurfaceClassName}>
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
            </FormPageContent>
        </AppLayout>
    );
}
