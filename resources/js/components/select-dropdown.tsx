import type { ChangeEvent, SelectHTMLAttributes } from 'react';
import { forwardRef } from 'react';

import { FormDropdown } from '@/components/form-dropdown';
import type { FormDropdownOption } from '@/components/form-dropdown';

export type SelectOption = FormDropdownOption;

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
    label: string;
    options: SelectOption[];
    error?: string;
    placeholder?: string;
};

export const SelectDropdown = forwardRef<HTMLInputElement, Props>(function SelectDropdown(
    { label, options, error, id, placeholder = 'Select…', className, ...rest },
    ref,
) {
    const selectId = id ?? (typeof rest.name === 'string' ? rest.name : 'select-dropdown');
    const controlled = rest.value !== undefined;
    const optionsIncludeEmpty = options.some((o) => o.value === '');

    return (
        <FormDropdown
            ref={ref}
            id={selectId}
            name={typeof rest.name === 'string' ? rest.name : selectId}
            label={label}
            options={options}
            allowEmpty={!optionsIncludeEmpty}
            emptyOptionLabel={placeholder}
            placeholder={placeholder}
            error={error}
            required={Boolean(rest.required)}
            disabled={Boolean(rest.disabled)}
            className={className}
            defaultValue={
                controlled ? undefined : rest.defaultValue !== undefined ? String(rest.defaultValue) : undefined
            }
            value={controlled ? String(rest.value ?? '') : undefined}
            onValueChange={
                controlled && rest.onChange
                    ? (v: string) =>
                          rest.onChange!({
                              target: { value: v },
                          } as ChangeEvent<HTMLSelectElement>)
                    : undefined
            }
        />
    );
});
