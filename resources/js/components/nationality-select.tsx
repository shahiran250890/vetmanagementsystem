import { useMemo } from 'react';

import type { NationalityOption } from '@/components/address-fields';
import { FormDropdown } from '@/components/form-dropdown';

type NationalitySelectProps = {
    id: string;
    name: string;
    label?: string;
    /** Marks the field required for assistive tech (native submit validation). */
    required?: boolean;
    nationalities: NationalityOption[];
    defaultValue?: string | null;
    error?: string;
    resetKey?: string | number;
};

/**
 * Dropdown for nationality / country-of-origin labels from the tenant `nationalities` table.
 * Submits the nationality **name** string (same pattern as address country).
 */
export function NationalitySelect({
    id,
    name,
    label = 'Nationality',
    required = false,
    nationalities,
    defaultValue,
    error,
    resetKey,
}: NationalitySelectProps) {
    const raw = defaultValue?.trim() ?? '';

    const options = useMemo(
        () => nationalities.map((n) => ({ value: n.name, label: n.name })),
        [nationalities],
    );

    return (
        <FormDropdown
            id={id}
            name={name}
            label={label}
            options={options}
            defaultValue={raw}
            allowEmpty
            emptyOptionLabel="Please select"
            placeholder="Please select"
            required={required}
            error={error}
            resetKey={resetKey}
        />
    );
}
