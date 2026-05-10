import { describe, expect, it } from 'vitest';

import { isStaffFormTabSelectable } from './staff-form-tab-policy';

describe('isStaffFormTabSelectable', () => {
    it('allows the personal tab while creating', () => {
        expect(isStaffFormTabSelectable('personal', false)).toBe(true);
    });

    it('blocks non-personal tabs while creating', () => {
        expect(isStaffFormTabSelectable('employment', false)).toBe(false);
        expect(isStaffFormTabSelectable('documents', false)).toBe(false);
    });

    it('allows every tab while editing', () => {
        expect(isStaffFormTabSelectable('personal', true)).toBe(true);
        expect(isStaffFormTabSelectable('roles', true)).toBe(true);
    });
});
