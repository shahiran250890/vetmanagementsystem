import { Head, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import type { SubmitEventHandler } from 'react';

import { FormPageContent, formPageSurfaceClassName } from '@/components/form-page-layout';
import PatientForm from '@/components/patients/patient-form';
import { createPatientFormSchema } from '@/components/patients/patient-form-schema';
import { createPatientFormFieldHandler } from '@/hooks/use-patient-form-field-handler';
import AppLayout from '@/layouts/app-layout';
import { zodIssuesToDotRecord } from '@/lib/zod-error-map';
import { create, index, store } from '@/routes/patients';
import type { BreadcrumbItem } from '@/types';
import type {
    AllowedPatientType,
    BloodTypeOption,
    OwnerOption,
    PatientFormData,
    PatientType,
    SpeciesOption,
} from '@/types/patient';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Patients', href: index() },
    { title: 'Register', href: create() },
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

    const allowedPatientTypes = useMemo((): PatientType[] => {
        if (allowedPatientType !== null) {
            return [allowedPatientType];
        }

        return ['human', 'animal'];
    }, [allowedPatientType]);

    const schema = useMemo(
        () => createPatientFormSchema({ allowedPatientTypes }),
        [allowedPatientTypes],
    );

    const [clientErrors, setClientErrors] = useState<Record<string, string>>({});

    const mergedErrors = useMemo(() => ({ ...errors, ...clientErrors }), [errors, clientErrors]);

    const submit: SubmitEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();

        const result = schema.safeParse(data);

        if (!result.success) {
            setClientErrors(zodIssuesToDotRecord(result.error));

            return;
        }

        setClientErrors({});
        post(store.url());
    };

    const updateFormData = createPatientFormFieldHandler(setData);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Register patient" />
            <FormPageContent title="Register patient" backHref={index()} backLabel="Back to patients">
                <form onSubmit={submit} className={formPageSurfaceClassName}>
                    <PatientForm
                        data={data}
                        setData={updateFormData}
                        errors={mergedErrors}
                        processing={processing}
                        owners={owners}
                        bloodTypes={bloodTypes}
                        speciesOptions={speciesOptions}
                        submitLabel="Register patient"
                        allowedPatientType={allowedPatientType}
                    />
                </form>
            </FormPageContent>
        </AppLayout>
    );
}
