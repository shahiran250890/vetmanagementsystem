import { Head, useForm } from '@inertiajs/react';
import type { SubmitEventHandler } from 'react';
import { FormPageContent, formPageSurfaceClassName } from '@/components/form-page-layout';
import PatientForm from '@/components/patients/patient-form';
import { createPatientFormFieldHandler } from '@/hooks/use-patient-form-field-handler';
import AppLayout from '@/layouts/app-layout';
import { normalizeGenderSelectValue } from '@/lib/gender-selection';
import { edit, index, show, update } from '@/routes/patients';
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
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Patients', href: index() },
        { title: patient.name, href: show(patient.id) },
        { title: 'Edit', href: edit(patient.id) },
    ];

    const { data, setData, put, processing, errors } = useForm<PatientFormData>({
        patient_type: allowedPatientType ?? patient.patient_type,
        name: patient.name,
        sex: normalizeGenderSelectValue(patient.sex),
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

    const submit: SubmitEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        put(update.url(patient.id));
    };

    const updateFormData = createPatientFormFieldHandler(setData);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${patient.name}`} />
            <FormPageContent
                title="Edit patient"
                backHref={show(patient.id)}
                backLabel="Back to patient"
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
                        submitLabel="Update patient"
                        allowedPatientType={allowedPatientType}
                    />
                </form>
            </FormPageContent>
        </AppLayout>
    );
}
