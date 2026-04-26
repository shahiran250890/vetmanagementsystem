export type PatientType = 'human' | 'animal';
export type AllowedPatientType = PatientType | null;

export type PatientStatus = 'active' | 'deceased' | 'transferred';

export type PatientAnimalProfileForm = {
    owner_user_id: string;
    species: string;
    breed: string;
    color: string;
    microchip_number: string;
    latest_weight_kg: string;
    vaccination_status: string;
};

export type PatientHumanProfileForm = {
    identification_number: string;
    blood_type_id: string;
    primary_phone: string;
    address: string;
    height_cm: string;
    weight_kg: string;
    blood_pressure: string;
    vital_medical_information: string;
};

export type PatientFormData = {
    patient_type: PatientType;
    name: string;
    sex: string;
    date_of_birth: string;
    emergency_contact_name: string;
    emergency_contact_phone: string;
    allergies: string;
    current_medications: string;
    status: PatientStatus;
    notes: string;
    animal_profile: PatientAnimalProfileForm;
    human_profile: PatientHumanProfileForm;
};

export type OwnerOption = {
    id: number;
    name: string;
};

export type BloodTypeOption = {
    id: number;
    name: string;
};

export type BreedOption = {
    id: number;
    name: string;
};

export type SpeciesOption = {
    id: number;
    name: string;
    breeds: BreedOption[];
};

export type HistoryEntry = {
    id: number;
    entry_date: string | null;
    visit_case_number?: string | null;
    visit_at?: string | null;
    clinic_location?: string | null;
    visit_type?: string | null;
    visit_status?: string | null;
    appointment_id?: string | null;
    entry_type: string | null;
    title: string;
    details: string;
    creator?: {
        id: number;
        name: string;
    } | null;
};

export type PatientRecord = {
    id: number;
    patient_type: PatientType;
    name: string;
    sex: string | null;
    date_of_birth: string | null;
    emergency_contact_name: string | null;
    emergency_contact_phone: string | null;
    allergies: string | null;
    current_medications: string | null;
    status: PatientStatus;
    notes: string | null;
    species: string | null;
    breed: string | null;
    color: string | null;
    microchip_number: string | null;
    latest_weight_kg: string | null;
    vaccination_status: string | null;
    user_id: number | null;
    user?: {
        id: number;
        name: string;
    } | null;
    animal_profile?: {
        owner_user_id: number | null;
        species: string;
        breed: string | null;
        color: string | null;
        microchip_number: string | null;
        latest_weight_kg: string | null;
        vaccination_status: string | null;
    } | null;
    human_profile?: {
        identification_number: string | null;
        blood_type_id: number | null;
        blood_type: string | null;
        primary_phone: string | null;
        address: string | null;
        height_cm: string | null;
        weight_kg: string | null;
        blood_pressure: string | null;
        vital_medical_information: string | null;
    } | null;
    history_entries: HistoryEntry[];
};
