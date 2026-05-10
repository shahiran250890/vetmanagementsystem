import { useMemo } from 'react';

import { FormDropdown } from '@/components/form-dropdown';

export type GenderSelectionProps = {
    id: string;
    name: string;
    /** Defaults to "Gender". */
    label?: string;
    /** Marks the field required for assistive tech (native submit validation). */
    required?: boolean;
    error?: string;
    className?: string;
    disabled?: boolean;
    /** When set, the select is controlled (`value` / `onChange`). */
    value?: string;
    onChange?: (value: string) => void;
    /** Used when `value` is undefined (native form submit). */
    defaultValue?: string;
    resetKey?: string | number;
};

const OPTIONS = [
    { value: '1', label: 'Male' },
    { value: '2', label: 'Female' },
];

export function GenderSelection({
    id,
    name,
    label = 'Gender',
    required = false,
    error,
    className,
    disabled,
    value,
    onChange,
    defaultValue,
    resetKey,
}: GenderSelectionProps) {
    const controlled = value !== undefined;

    const options = useMemo(() => OPTIONS, []);

    return (
        <FormDropdown
            id={id}
            name={name}
            label={label}
            options={options}
            allowEmpty
            emptyOptionLabel="Please select"
            placeholder="Please select"
            required={required}
            disabled={disabled}
            error={error}
            className={className}
            defaultValue={controlled ? undefined : defaultValue ?? ''}
            value={controlled ? value : undefined}
            onValueChange={controlled ? onChange : undefined}
            resetKey={resetKey}
        />
    );
}
