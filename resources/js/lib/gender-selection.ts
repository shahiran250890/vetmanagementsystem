/**
 * Shared encoding for patient `sex` and staff `gender`: `1` = Male, `2` = Female.
 */
export function normalizeGenderSelectValue(input: string | null | undefined): string {
    if (input == null || input === '') {
        return '';
    }

    const g = String(input).trim();
    if (g === '1' || g === '2') {
        return g;
    }

    const lower = g.toLowerCase();
    if (lower === 'male') {
        return '1';
    }
    if (lower === 'female') {
        return '2';
    }

    return '';
}

export function genderDisplayLabel(input: string | null | undefined): string {
    const v = normalizeGenderSelectValue(input);
    if (v === '1') {
        return 'Male';
    }
    if (v === '2') {
        return 'Female';
    }

    return '—';
}
