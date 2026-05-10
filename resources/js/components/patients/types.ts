import type {
    HistoryEntry,
    MedicalCertificateSummary,
    PatientRecord,
} from '@/types/patient';

export type PatientWorkspaceTab =
    | 'information'
    | 'history'
    | 'new-record'
    | 'medical-certificate';

export type Patient = PatientRecord;

export type MedicalRecord = HistoryEntry & {
    chief_complaint?: string | null;
    diagnosis?: string | null;
    treatment?: string | null;
    prescription_summary?: string | null;
    vital_signs?: VitalSigns | null;
    follow_up_date?: string | null;
};

export type MedicalCertificate = MedicalCertificateSummary;

export type Allergy = {
    id?: number | string;
    label: string;
    severity?: 'low' | 'medium' | 'high' | 'critical' | null;
};

export type VitalSigns = {
    blood_pressure?: string | null;
    heart_rate?: string | number | null;
    respiratory_rate?: string | number | null;
    temperature?: string | number | null;
    oxygen_saturation?: string | number | null;
    height_cm?: string | number | null;
    weight_kg?: string | number | null;
};

export type NewMedicalRecordFormData = {
    entry_date: string;
    visit_at: string;
    veterinarian_user_id: string;
    assistant_user_id: string;
    visit_type: string;
    appointment_id: string;
    visit_status: string;
    entry_type: string;
    title: string;
    symptoms: string;
    diagnosis: string;
    details: string;
};

export type MedicalCertificateFormData = {
    medical_record_id: string | number;
    employer_name: string;
    unfit_from: string;
    unfit_to: string;
    remarks: string;
};

export type FormErrors<TData extends object> = Partial<
    Record<keyof TData | string, string>
>;
