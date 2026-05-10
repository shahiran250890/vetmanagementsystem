import { describe, expect, it } from 'vitest';

import { organizationProfileFormSchema, parseOrganizationProfileFormData } from './organization-profile-form-schema';

describe('organizationProfileFormSchema', () => {
    it('accepts a valid payload', () => {
        const fd = new FormData();
        fd.set('clinic_type', 'vet');
        fd.set('organization_name', 'Clinic A');
        fd.set('organization_phone', '555');
        fd.set('organization_email', 'c@example.test');
        fd.set('organization_fax', '555');
        fd.set('organization_license', 'L1');
        fd.set('organization_address', '');

        const parsed = parseOrganizationProfileFormData(fd);
        const result = organizationProfileFormSchema.safeParse(parsed);

        expect(result.success).toBe(true);
    });

    it('rejects invalid email', () => {
        const result = organizationProfileFormSchema.safeParse({
            clinic_type: 'human',
            organization_name: 'X',
            organization_phone: '1',
            organization_email: 'not-an-email',
            organization_fax: '1',
            organization_license: 'L',
            organization_address: '',
        });

        expect(result.success).toBe(false);
    });
});
