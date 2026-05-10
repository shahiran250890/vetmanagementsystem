import type { ChangeEvent } from 'react';

import { nativeSelectClassName } from '@/components/form-page-layout';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export type GenderSelectionProps = {
    id: string;
    name: string;
    /** Defaults to "Sex" (matches patient forms). */
    label?: string;
    error?: string;
    className?: string;
    disabled?: boolean;
    /** When set, the select is controlled (`value` / `onChange`). */
    value?: string;
    onChange?: (value: string) => void;
    /** Used when `value` is undefined (native form submit). */
    defaultValue?: string;
};

export function GenderSelection({
    id,
    name,
    label = 'Sex',
    error,
    className,
    disabled,
    value,
    onChange,
    defaultValue,
}: GenderSelectionProps) {
    const controlled = value !== undefined;

    return (
        <div className="grid gap-2">
            <Label htmlFor={id}>{label}</Label>
            <select
                id={id}
                name={name}
                className={cn(nativeSelectClassName, className)}
                disabled={disabled}
                {...(controlled
                    ? {
                          value,
                          onChange: (event: ChangeEvent<HTMLSelectElement>) => onChange?.(event.target.value),
                      }
                    : { defaultValue: defaultValue ?? '' })}
            >
                <option value="">Please select</option>
                <option value="1">Male</option>
                <option value="2">Female</option>
            </select>
            <InputError message={error} />
        </div>
    );
}
