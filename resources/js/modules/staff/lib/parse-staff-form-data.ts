/**
 * Converts `FormData` from the staff HTML form into a plain object compatible with
 * `App\Http\Requests\Settings\StaffManagementRequest` input (after `prepareForValidation`).
 */

/** Last entry wins (matches PHP request duplicate-key behaviour for checkbox + hidden pairs). */
function lastFormValue(formData: FormData, key: string): string | undefined {
    const all = formData.getAll(key);

    if (all.length === 0) {
        return undefined;
    }

    const last = all[all.length - 1];

    if (typeof last === 'string') {
        return last;
    }

    if (last instanceof File) {
        return last.name === '' ? undefined : last.name;
    }

    return String(last);
}

function parseBooleanField(formData: FormData, key: string): boolean {
    const raw = lastFormValue(formData, key);

    if (raw === undefined) {
        return false;
    }

    return raw === '1' || raw === 'true' || raw === 'on';
}

function optionalTrimmedString(formData: FormData, key: string): string | undefined {
    const raw = lastFormValue(formData, key);

    if (raw === undefined) {
        return undefined;
    }

    return raw.trim();
}

function collectRoleIds(formData: FormData): number[] {
    const ids: number[] = [];
    const keys = ['role_ids[]', 'role_ids'];

    for (const key of keys) {
        for (const v of formData.getAll(key)) {
            const n = Number.parseInt(String(v), 10);

            if (!Number.isNaN(n)) {
                ids.push(n);
            }
        }
    }

    return ids;
}

export type StaffFormParsed = {
    staff_number_source?: 'auto' | 'manual';
    staff_number?: string;
    full_name: string;
    preferred_name?: string;
    nric_passport?: string;
    gender?: string;
    date_of_birth?: string;
    nationality?: string;
    marital_status?: string;
    photo_path?: string;
    mobile_number?: string;
    alternate_phone?: string;
    email?: string;
    address_line_1?: string;
    address_line_2?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
    emergency_contact_name?: string;
    emergency_contact_phone?: string;
    employee_number?: string;
    hire_date?: string;
    confirmation_date?: string;
    position?: string;
    department?: string;
    reporting_manager_id?: number;
    employment_type?: string;
    salary_type?: string;
    assigned_clinics_text?: string;
    working_hours?: string;
    employment_status?: string;
    is_active: boolean;
    medical_registration_number?: string;
    apc_number?: string;
    apc_expiry_date?: string;
    specialization?: string;
    qualifications?: string;
    years_experience?: number;
    documents_metadata?: string;
    enable_login: boolean;
    account_email?: string;
    is_enabled: boolean;
    password?: string;
    password_confirmation?: string;
    role_ids: number[];
};

export function parseStaffFormData(formData: FormData): StaffFormParsed {
    const src = optionalTrimmedString(formData, 'staff_number_source');

    let staff_number_source: 'auto' | 'manual' | undefined;

    if (src === 'auto' || src === 'manual') {
        staff_number_source = src;
    }

    const staff_number_raw = optionalTrimmedString(formData, 'staff_number');
    const password = optionalTrimmedString(formData, 'password');
    const password_confirmation = optionalTrimmedString(formData, 'password_confirmation');

    const yearsExperienceRaw = optionalTrimmedString(formData, 'years_experience');
    let years_experience: number | undefined;

    if (yearsExperienceRaw !== undefined && yearsExperienceRaw !== '') {
        const y = Number.parseInt(yearsExperienceRaw, 10);

        if (!Number.isNaN(y)) {
            years_experience = y;
        }
    }

    const reportingRaw = optionalTrimmedString(formData, 'reporting_manager_id');
    let reporting_manager_id: number | undefined;

    if (reportingRaw !== undefined && reportingRaw !== '') {
        const r = Number.parseInt(reportingRaw, 10);

        if (!Number.isNaN(r)) {
            reporting_manager_id = r;
        }
    }

    const full_name = optionalTrimmedString(formData, 'full_name') ?? '';

    return {
        ...(staff_number_source !== undefined ? { staff_number_source } : {}),
        ...(staff_number_raw !== undefined ? { staff_number: staff_number_raw } : {}),
        full_name,
        preferred_name: optionalTrimmedString(formData, 'preferred_name'),
        nric_passport: optionalTrimmedString(formData, 'nric_passport'),
        gender: optionalTrimmedString(formData, 'gender'),
        date_of_birth: optionalTrimmedString(formData, 'date_of_birth'),
        nationality: optionalTrimmedString(formData, 'nationality'),
        marital_status: optionalTrimmedString(formData, 'marital_status'),
        photo_path: optionalTrimmedString(formData, 'photo_path'),
        mobile_number: optionalTrimmedString(formData, 'mobile_number'),
        alternate_phone: optionalTrimmedString(formData, 'alternate_phone'),
        email: optionalTrimmedString(formData, 'email'),
        address_line_1: optionalTrimmedString(formData, 'address_line_1'),
        address_line_2: optionalTrimmedString(formData, 'address_line_2'),
        city: optionalTrimmedString(formData, 'city'),
        state: optionalTrimmedString(formData, 'state'),
        postcode: optionalTrimmedString(formData, 'postcode'),
        country: optionalTrimmedString(formData, 'country'),
        emergency_contact_name: optionalTrimmedString(formData, 'emergency_contact_name'),
        emergency_contact_phone: optionalTrimmedString(formData, 'emergency_contact_phone'),
        employee_number: optionalTrimmedString(formData, 'employee_number'),
        hire_date: optionalTrimmedString(formData, 'hire_date'),
        confirmation_date: optionalTrimmedString(formData, 'confirmation_date'),
        position: optionalTrimmedString(formData, 'position'),
        department: optionalTrimmedString(formData, 'department'),
        ...(reporting_manager_id !== undefined ? { reporting_manager_id } : {}),
        employment_type: optionalTrimmedString(formData, 'employment_type'),
        salary_type: optionalTrimmedString(formData, 'salary_type'),
        assigned_clinics_text: optionalTrimmedString(formData, 'assigned_clinics_text'),
        working_hours: optionalTrimmedString(formData, 'working_hours'),
        employment_status: optionalTrimmedString(formData, 'employment_status'),
        is_active: parseBooleanField(formData, 'is_active'),
        medical_registration_number: optionalTrimmedString(formData, 'medical_registration_number'),
        apc_number: optionalTrimmedString(formData, 'apc_number'),
        apc_expiry_date: optionalTrimmedString(formData, 'apc_expiry_date'),
        specialization: optionalTrimmedString(formData, 'specialization'),
        qualifications: optionalTrimmedString(formData, 'qualifications'),
        ...(years_experience !== undefined ? { years_experience } : {}),
        documents_metadata: optionalTrimmedString(formData, 'documents_metadata'),
        enable_login: parseBooleanField(formData, 'enable_login'),
        account_email: optionalTrimmedString(formData, 'account_email'),
        is_enabled: parseBooleanField(formData, 'is_enabled'),
        ...(password !== undefined && password !== '' ? { password } : {}),
        ...(password_confirmation !== undefined && password_confirmation !== ''
            ? { password_confirmation }
            : {}),
        role_ids: collectRoleIds(formData),
    };
}
