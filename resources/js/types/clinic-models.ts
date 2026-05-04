export type Patient = {
    id: number;
    patient_type: 'animal' | 'human';
    name: string;
    status: string;
    species?: string | null;
    breed?: string | null;
    sex?: string | null;
    date_of_birth?: string | null;
    animal_profile?: Record<string, unknown> | null;
    human_profile?: Record<string, unknown> | null;
};

export type Appointment = {
    id: number;
    patient_id: number;
    doctor_id: number;
    appointment_datetime: string | null;
    type: string;
    status: string;
    notes?: string | null;
    patient?: { id: number; name: string };
    doctor?: { id: number; name: string };
};

export type MedicalRecord = {
    id: number;
    patient_id: number;
    doctor_id: number;
    appointment_id: number | null;
    symptoms?: string | null;
    diagnosis?: string | null;
    treatment?: string | null;
    notes?: string | null;
    patient?: { id: number; name: string };
    doctor?: { id: number; name: string };
    prescriptions?: Prescription[];
};

export type Prescription = {
    id: number;
    medicine_name: string;
    dosage?: string | null;
    duration?: string | null;
    instructions?: string | null;
};

export type Bill = {
    id: number;
    patient_id: number;
    total_amount: string;
    status: string;
    patient?: { id: number; name: string };
    items?: BillItem[];
    payments?: Payment[];
};

export type BillItem = {
    id: number;
    item_type: string;
    description?: string | null;
    amount: string;
};

export type Payment = {
    id: number;
    bill_id: number;
    amount: string;
    method: string;
    paid_at: string | null;
};

export type DoctorOption = {
    id: number;
    name: string;
    email: string;
};
