import type { PatientFormData } from '@/types/patient';

/**
 * Clears core fields and nested profiles when switching patient type (create/edit parity).
 */
export function initialPatientFormStateAfterTypeChange(
    patientType: PatientFormData['patient_type'],
): PatientFormData {
    return {
        patient_type: patientType,
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
    };
}

type PatientFormSetData = (
    data:
        | PatientFormData
        | keyof PatientFormData
        | ((
              previous: PatientFormData,
          ) => PatientFormData),
    value?: PatientFormData[keyof PatientFormData],
) => void;

/**
 * Shared Inertia useForm setData handler for patient create/edit forms.
 */
export function createPatientFormFieldHandler(setData: PatientFormSetData): (key: string, value: string) => void {
    return (key: string, value: string) => {
        if (key === 'patient_type') {
            setData(initialPatientFormStateAfterTypeChange(value as PatientFormData['patient_type']));
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
}
