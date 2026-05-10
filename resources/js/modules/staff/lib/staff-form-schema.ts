/**
 * Client-side validation for the staff create/update form. Must stay aligned with
 * `App\Http\Requests\Settings\StaffManagementRequest` (subset: shape, lengths, conditionals).
 * Database rules (`unique`, `exists`, …) remain server-only.
 */

import { z } from 'zod';

import type { StaffFormParsed } from './parse-staff-form-data';

export type StaffFormSchemaContext = {
    mode: 'create' | 'edit';
    doctorRoleIds: number[];
    /** True when a login user record already exists for this staff member */
    hasLinkedUser: boolean;
    /** Staff id when editing — used to forbid selecting self as reporting manager */
    managedStaffId?: number;
};

const EMPLOYMENT_STATUSES = [
    'active',
    'on_leave',
    'probation',
    'suspended',
    'resigned',
    'terminated',
] as const;

export function requiresDoctorProfessionalFields(
    roleIds: number[],
    position: string | undefined,
    doctorRoleIds: number[],
): boolean {
    if (roleIds.length === 0) {
        return position !== undefined && position.toLowerCase().includes('doctor');
    }

    return roleIds.some((id) => doctorRoleIds.includes(id));
}

function maxString(max: number) {
    return z.preprocess(
        (val: unknown) => (val === undefined || val === null ? '' : String(val)),
        z
            .string()
            .max(max)
            .transform((v) => (v.trim() === '' ? undefined : v.trim())),
    );
}

const optionalEmailLike = z.preprocess(
    (val: unknown) => (val === undefined || val === null || val === '' ? undefined : String(val)),
    z.union([z.undefined(), z.string().max(255).email('Enter a valid email address.')]),
);

function baseStaffShape() {
    return {
        staff_number_source: z.enum(['auto', 'manual']).optional(),
        staff_number: maxString(64),
        full_name: z.string().trim().min(1, 'Full name is required.').max(255),
        preferred_name: maxString(255),
        nric_passport: maxString(64),
        gender: z.union([z.literal(''), z.literal('1'), z.literal('2')]).optional(),
        date_of_birth: maxString(32),
        nationality: maxString(120),
        marital_status: maxString(32),
        photo_path: maxString(2048),
        mobile_number: maxString(32),
        alternate_phone: maxString(32),
        email: optionalEmailLike,
        address_line_1: maxString(255),
        address_line_2: maxString(255),
        city: maxString(120),
        state: maxString(120),
        postcode: maxString(16),
        country: maxString(120),
        emergency_contact_name: maxString(255),
        emergency_contact_phone: maxString(32),
        employee_number: maxString(64),
        hire_date: maxString(32),
        confirmation_date: maxString(32),
        position: maxString(255),
        department: maxString(255),
        reporting_manager_id: z.number().int().positive().optional(),
        employment_type: maxString(64),
        salary_type: maxString(64),
        assigned_clinics_text: maxString(4096),
        working_hours: maxString(255),
        employment_status: z.enum(EMPLOYMENT_STATUSES),
        is_active: z.boolean(),
        medical_registration_number: maxString(64),
        apc_number: maxString(64),
        apc_expiry_date: maxString(32),
        specialization: maxString(255),
        qualifications: maxString(65535),
        years_experience: z.number().int().min(0).max(80).optional(),
        documents_metadata: maxString(65535),
        enable_login: z.boolean(),
        account_email: maxString(255),
        is_enabled: z.boolean(),
        password: maxString(255),
        password_confirmation: maxString(255),
        role_ids: z.array(z.number().int().positive()),
    };
}

export function createStaffManagementSchema(context: StaffFormSchemaContext): z.ZodType<StaffFormParsed> {
    return z
        .object(baseStaffShape())
        .superRefine((data, refinementCtx) => {
            if (context.mode === 'create') {
                if (data.staff_number_source === undefined) {
                    refinementCtx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'Choose how the staff number should be assigned.',
                        path: ['staff_number_source'],
                    });
                } else if (data.staff_number_source === 'manual') {
                    const sn = data.staff_number?.trim() ?? '';

                    if (sn === '') {
                        refinementCtx.addIssue({
                            code: z.ZodIssueCode.custom,
                            message: 'Staff number is required when entering manually.',
                            path: ['staff_number'],
                        });
                    }
                }
            }

            const nric = data.nric_passport?.trim() ?? '';

            if (nric === '') {
                refinementCtx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'NRIC / Passport is required.',
                    path: ['nric_passport'],
                });
            }

            if (data.gender !== '1' && data.gender !== '2') {
                refinementCtx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Gender is required.',
                    path: ['gender'],
                });
            }

            const dob = data.date_of_birth?.trim() ?? '';

            if (dob === '') {
                refinementCtx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Date of birth is required.',
                    path: ['date_of_birth'],
                });
            } else if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
                refinementCtx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Enter a valid date of birth.',
                    path: ['date_of_birth'],
                });
            }

            const nationality = data.nationality?.trim() ?? '';

            if (nationality === '') {
                refinementCtx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Nationality is required.',
                    path: ['nationality'],
                });
            }

            const mobile = data.mobile_number?.trim() ?? '';

            if (mobile === '') {
                refinementCtx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Mobile number is required.',
                    path: ['mobile_number'],
                });
            }

            const contactEmail = data.email?.trim() ?? '';

            if (contactEmail === '') {
                refinementCtx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Work / contact email is required.',
                    path: ['email'],
                });
            } else if (!z.email().safeParse(contactEmail).success) {
                refinementCtx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'Enter a valid work / contact email address.',
                    path: ['email'],
                });
            }

            const needsDoctor = requiresDoctorProfessionalFields(
                data.role_ids,
                data.position,
                context.doctorRoleIds,
            );

            if (needsDoctor) {
                if (!(data.medical_registration_number?.trim())) {
                    refinementCtx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'Medical council registration is required for this role.',
                        path: ['medical_registration_number'],
                    });
                }

                if (!(data.apc_number?.trim())) {
                    refinementCtx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'APC number is required for this role.',
                        path: ['apc_number'],
                    });
                }
            }

            if (
                context.mode === 'edit'
                && context.managedStaffId !== undefined
                && data.reporting_manager_id === context.managedStaffId
            ) {
                refinementCtx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: 'A staff member cannot be their own reporting manager.',
                    path: ['reporting_manager_id'],
                });
            }

            if (data.enable_login) {
                const email = data.account_email?.trim() ?? '';

                if (email === '') {
                    refinementCtx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'Login email is required when login is enabled.',
                        path: ['account_email'],
                    });
                } else if (!z.email().safeParse(email).success) {
                    refinementCtx.addIssue({
                        code: z.ZodIssueCode.custom,
                        message: 'Enter a valid login email address.',
                        path: ['account_email'],
                    });
                }

                const pwd = data.password ?? '';
                const pwdConfirm = data.password_confirmation ?? '';

                if (!context.hasLinkedUser) {
                    if (pwd.length < 8) {
                        refinementCtx.addIssue({
                            code: z.ZodIssueCode.custom,
                            message: 'Password must be at least 8 characters.',
                            path: ['password'],
                        });
                    }

                    if (pwd !== pwdConfirm) {
                        refinementCtx.addIssue({
                            code: z.ZodIssueCode.custom,
                            message: 'Password confirmation does not match.',
                            path: ['password_confirmation'],
                        });
                    }
                } else if (pwd.length > 0) {
                    if (pwd.length < 8) {
                        refinementCtx.addIssue({
                            code: z.ZodIssueCode.custom,
                            message: 'Password must be at least 8 characters.',
                            path: ['password'],
                        });
                    }

                    if (pwd !== pwdConfirm) {
                        refinementCtx.addIssue({
                            code: z.ZodIssueCode.custom,
                            message: 'Password confirmation does not match.',
                            path: ['password_confirmation'],
                        });
                    }
                }
            }
        }) as z.ZodType<StaffFormParsed>;
}
