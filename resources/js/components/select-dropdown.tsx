import { forwardRef } from 'react';
import type { SelectHTMLAttributes } from 'react';

import { nativeSelectClassName } from '@/components/form-page-layout';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export type SelectOption = { value: string; label: string };

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
    label: string;
    options: SelectOption[];
    error?: string;
    placeholder?: string;
};

export const SelectDropdown = forwardRef<HTMLSelectElement, Props>(
    function SelectDropdown(
        {
            label,
            options,
            error,
            id,
            placeholder = 'Select…',
            className = '',
            ...rest
        },
        ref,
    ) {
        const selectId = id ?? rest.name;

        return (
            <div className="grid gap-2">
                <Label htmlFor={selectId}>{label}</Label>
                <select
                    ref={ref}
                    id={selectId}
                    className={cn(nativeSelectClassName, className)}
                    {...rest}
                >
                    <option value="">{placeholder}</option>
                    {options.map((o) => (
                        <option key={o.value} value={o.value}>
                            {o.label}
                        </option>
                    ))}
                </select>
                <InputError message={error} />
            </div>
        );
    },
);
