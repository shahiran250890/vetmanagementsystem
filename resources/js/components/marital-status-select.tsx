import { useMemo } from 'react';

import { FormDropdown } from '@/components/form-dropdown';

const OPTIONS = [
    { value: 'single', label: 'Single' },
    { value: 'married', label: 'Married' },
];

type MaritalStatusSelectProps = {
    id: string;
    name: string;
    label?: string;
    defaultValue?: string | null;
    error?: string;
    resetKey?: string | number;
};

function canonicalStoredValue(stored: string | null | undefined): string {
    const raw = stored?.trim() ?? '';

    if (raw === '') {
        return '';
    }

    const lower = raw.toLowerCase();

    return lower === 'single' || lower === 'married' ? lower : raw;
}

/**
 * Marital status dropdown: submits `single` or `married` (or a legacy free-text value when migrating older records).
 */
export function MaritalStatusSelect({
    id,
    name,
    label = 'Marital status',
    defaultValue,
    error,
    resetKey,
}: MaritalStatusSelectProps) {
    const canonical = canonicalStoredValue(defaultValue);

    const options = useMemo(() => OPTIONS, []);

    return (
        <FormDropdown
            id={id}
            name={name}
            label={label}
            options={options}
            defaultValue={canonical}
            allowEmpty
            emptyOptionLabel="Please select"
            placeholder="Please select"
            error={error}
            resetKey={resetKey}
        />
    );
}
