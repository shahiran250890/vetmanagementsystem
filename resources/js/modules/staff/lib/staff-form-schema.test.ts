import { describe, expect, it } from 'vitest';

import { zodIssuesToDotRecord } from '@/lib/zod-error-map';

import type { StaffFormParsed } from './parse-staff-form-data';
import { createStaffManagementSchema, requiresDoctorProfessionalFields } from './staff-form-schema';

function minimalValidPayload(overrides: Partial<StaffFormParsed> = {}): StaffFormParsed {
    return {
        staff_number_source: 'auto',
        full_name: 'Jane Doe',
        employment_status: 'active',
        is_active: true,
        enable_login: false,
        is_enabled: true,
        role_ids: [],
        ...overrides,
    };
}

describe('requiresDoctorProfessionalFields', () => {
    it('detects doctor via position when no roles selected', () => {
        expect(requiresDoctorProfessionalFields([], 'Senior Doctor', [99])).toBe(true);
        expect(requiresDoctorProfessionalFields([], 'Nurse', [99])).toBe(false);
    });

    it('detects doctor via doctor role id intersection', () => {
        expect(requiresDoctorProfessionalFields([3, 7], '', [7])).toBe(true);
        expect(requiresDoctorProfessionalFields([3], '', [7])).toBe(false);
    });
});

describe('createStaffManagementSchema', () => {
    it('requires staff_number when manual on create', () => {
        const schema = createStaffManagementSchema({
            mode: 'create',
            doctorRoleIds: [],
            hasLinkedUser: false,
        });

        const fail = schema.safeParse(
            minimalValidPayload({
                staff_number_source: 'manual',
                staff_number: '',
            }),
        );

        expect(fail.success).toBe(false);

        if (!fail.success) {
            expect(zodIssuesToDotRecord(fail.error).staff_number).toBeDefined();
        }
    });

    it('requires professional fields when doctor role selected', () => {
        const schema = createStaffManagementSchema({
            mode: 'edit',
            doctorRoleIds: [10],
            hasLinkedUser: true,
            managedStaffId: 1,
        });

        const fail = schema.safeParse(
            minimalValidPayload({
                role_ids: [10],
                medical_registration_number: '',
                apc_number: '',
                reporting_manager_id: 2,
            }),
        );

        expect(fail.success).toBe(false);

        if (!fail.success) {
            const flat = zodIssuesToDotRecord(fail.error);
            expect(flat.medical_registration_number).toBeDefined();
            expect(flat.apc_number).toBeDefined();
        }
    });

    it('accepts a minimal valid create payload', () => {
        const schema = createStaffManagementSchema({
            mode: 'create',
            doctorRoleIds: [],
            hasLinkedUser: false,
        });

        const ok = schema.safeParse(
            minimalValidPayload({
                staff_number_source: 'auto',
                enable_login: false,
            }),
        );

        expect(ok.success).toBe(true);
    });
});
