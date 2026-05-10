export type StaffRole = { id: number; name: string };

export type StaffReportingManager = {
    id: number;
    full_name: string;
    staff_number: string;
};

/** Matches backend `StaffManagementController::managedStaffPayload` */
export type StaffMember = {
    id: number;
    staff_number: string;
    full_name: string;
    preferred_name: string | null;
    nric_passport: string | null;
    /** Same encoding as patient `sex`: `1` Male, `2` Female */
    gender: string | null;
    date_of_birth: string | null;
    nationality: string | null;
    marital_status: string | null;
    photo_path: string | null;
    mobile_number: string | null;
    alternate_phone: string | null;
    email: string | null;
    address_line_1: string | null;
    address_line_2: string | null;
    city: string | null;
    state: string | null;
    postcode: string | null;
    country: string | null;
    emergency_contact_name: string | null;
    emergency_contact_phone: string | null;
    employee_number: string | null;
    hire_date: string | null;
    confirmation_date: string | null;
    position: string | null;
    department: string | null;
    reporting_manager_id: number | null;
    reporting_manager: StaffReportingManager | null;
    employment_type: string | null;
    salary_type: string | null;
    assigned_clinics: string[];
    working_hours: string | null;
    employment_status: string;
    is_active: boolean;
    medical_registration_number: string | null;
    apc_number: string | null;
    apc_expiry_date: string | null;
    specialization: string | null;
    qualifications: string | null;
    years_experience: number | null;
    documents: unknown[];
    roles: StaffRole[];
    enable_login: boolean;
    account_email: string | null;
    is_enabled: boolean;
    two_factor_confirmed_at: string | null;
    created_at: string | null;
    updated_at: string | null;
    user_id: number | null;
};

export type StaffFilters = {
    search: string;
    sort: string;
    direction: string;
    role_id: number | null;
    department: string;
    employment_status: string;
    clinic: string;
    per_page: number;
};

export type StaffFilterOptions = {
    departments: string[];
    clinics: string[];
};
