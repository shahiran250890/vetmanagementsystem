import { describe, expect, it } from 'vitest';

import { parseStaffFormData } from './parse-staff-form-data';

describe('parseStaffFormData', () => {
    it('parses role_ids from role_ids[] keys', () => {
        const fd = new FormData();
        fd.append('role_ids[]', '2');
        fd.append('role_ids[]', '5');
        fd.append('full_name', 'Test User');
        fd.append('employment_status', 'active');
        fd.append('is_active', '0');
        fd.append('is_active', '1');
        fd.append('enable_login', '0');
        fd.append('is_enabled', '0');

        const result = parseStaffFormData(fd);

        expect(result.role_ids).toEqual([2, 5]);
        expect(result.is_active).toBe(true);
    });

    it('uses the last value for duplicate boolean field names (hidden + control)', () => {
        const fd = new FormData();
        fd.append('full_name', 'A');
        fd.append('employment_status', 'active');
        fd.append('is_active', '0');
        fd.append('is_active', '0');
        fd.append('is_active', '1');
        fd.append('enable_login', '0');
        fd.append('is_enabled', '1');

        const result = parseStaffFormData(fd);

        expect(result.is_active).toBe(true);
    });
});
