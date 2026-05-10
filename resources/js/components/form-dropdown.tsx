import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { forwardRef, useMemo, useState } from 'react';

import { nativeSelectClassName } from '@/components/form-page-layout';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export type FormDropdownOption = {
    value: string;
    label: string;
};

export type FormDropdownProps = {
    id: string;
    name: string;
    label: string;
    options: FormDropdownOption[];
    /** Submitted value; may be absent from `options` — an extra “(legacy)” row is shown. */
    defaultValue?: string | null;
    /** Prepends a row that submits `""` (e.g. “Please select”, “All”). */
    allowEmpty?: boolean;
    /** Label for the empty-value row when `allowEmpty` is true. */
    emptyOptionLabel?: string;
    /** Controlled value (string; use "" for no selection). */
    value?: string;
    /** Controlled updates — receives the submitted string value. */
    onValueChange?: (value: string) => void;
    /** Shown when nothing is selected (closed state label comes from the selected option). */
    placeholder?: string;
    placeholderSearch?: string;
    emptyMessage?: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
    /** Bump when the backing record changes so the selection resets from props. */
    resetKey?: string | number;
};

function withOrphanOption(options: FormDropdownOption[], rawDefault: string | undefined): FormDropdownOption[] {
    const trimmed = rawDefault?.trim() ?? '';

    if (trimmed === '') {
        return options;
    }

    if (options.some((o) => o.value === trimmed)) {
        return options;
    }

    return [{ value: trimmed, label: `${trimmed} (legacy)` }, ...options];
}

function buildMergedOptions(
    options: FormDropdownOption[],
    defaultValue: string | undefined,
    allowEmpty: boolean,
    emptyLabel: string,
): FormDropdownOption[] {
    let merged = withOrphanOption(options, defaultValue);

    if (allowEmpty) {
        merged = [{ value: '', label: emptyLabel }, ...merged];
    }

    return merged;
}

const FormDropdownInner = forwardRef<HTMLInputElement, Omit<FormDropdownProps, 'resetKey'>>(function FormDropdownInner(
    {
        id,
        name,
        label,
        options,
        defaultValue,
        allowEmpty = false,
        emptyOptionLabel = 'Please select',
        value: controlledValue,
        onValueChange,
        placeholder = 'Please select',
        placeholderSearch = 'Search…',
        emptyMessage = 'No matches.',
        error,
        required = false,
        disabled = false,
        className,
    },
    ref,
) {
    const isControlled = controlledValue !== undefined;

    const mergedOptions = useMemo(
        () => buildMergedOptions(options, defaultValue ?? undefined, allowEmpty, emptyOptionLabel),
        [options, defaultValue, allowEmpty, emptyOptionLabel],
    );

    const [internalSelected, setInternalSelected] = useState<string>(() => defaultValue?.trim() ?? '');

    const selected = isControlled ? controlledValue : internalSelected;

    const setSelected = (next: string): void => {
        if (isControlled) {
            onValueChange?.(next);
        } else {
            setInternalSelected(next);
        }
    };

    const [query, setQuery] = useState('');

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();

        if (q === '') {
            return mergedOptions;
        }

        return mergedOptions.filter((opt) => {
            return opt.label.toLowerCase().includes(q) || opt.value.toLowerCase().includes(q);
        });
    }, [mergedOptions, query]);

    const labelForValue = (value: string): string => {
        if (value === '') {
            return '';
        }

        const opt = mergedOptions.find((o) => o.value === value);

        return opt?.label ?? value;
    };

    const comboboxValue = selected === '' ? null : selected;

    return (
        <div className={cn('grid gap-2', className)}>
            <Label htmlFor={id}>{label}</Label>
            <input ref={ref} type="hidden" name={name} value={selected} readOnly />
            <Combobox<string | null>
                value={comboboxValue}
                onChange={(v) => setSelected(v === null ? '' : v)}
                disabled={disabled}
                onClose={() => setQuery('')}
            >
                <div className="relative w-full">
                    <div className="flex w-full gap-1">
                        <ComboboxInput
                            id={id}
                            autoComplete="off"
                            displayValue={() => labelForValue(selected)}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder={selected === '' ? placeholder : placeholderSearch}
                            aria-required={required ? true : undefined}
                            aria-invalid={error ? true : undefined}
                            aria-describedby={error ? `${id}-error` : undefined}
                            className={cn(
                                nativeSelectClassName,
                                'flex-1',
                                error && 'border-destructive aria-invalid:border-destructive',
                            )}
                        />
                        <ComboboxButton
                            type="button"
                            disabled={disabled}
                            className={cn(
                                nativeSelectClassName,
                                'inline-flex w-10 shrink-0 items-center justify-center px-0',
                                disabled && 'pointer-events-none opacity-70',
                            )}
                            aria-label={`Open ${label}`}
                        >
                            <ChevronsUpDown className="text-muted-foreground size-4 shrink-0 opacity-70" />
                        </ComboboxButton>
                    </div>

                    <ComboboxOptions
                        portal
                        modal={false}
                        anchor="bottom start"
                        transition
                        className={cn(
                            'border-border bg-popover text-popover-foreground z-50 mt-1 max-h-60 min-w-[var(--anchor-width)] overflow-auto rounded-md border p-1 shadow-md',
                            'transition duration-100 ease-out data-closed:scale-95 data-closed:opacity-0',
                            'empty:invisible',
                        )}
                    >
                        {filtered.length === 0 ? (
                            <div className="text-muted-foreground px-3 py-2 text-sm">{emptyMessage}</div>
                        ) : (
                            filtered.map((opt) => (
                                <ComboboxOption
                                    key={opt.value === '' ? '__empty__' : opt.value}
                                    value={opt.value === '' ? null : opt.value}
                                    className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm data-focus:bg-accent data-selected:bg-accent/80"
                                >
                                    {({ selected: isSelected }) => (
                                        <>
                                            <span className="min-w-0 flex-1 truncate">{opt.label}</span>
                                            {isSelected ? <Check className="text-primary size-4 shrink-0" /> : null}
                                        </>
                                    )}
                                </ComboboxOption>
                            ))
                        )}
                    </ComboboxOptions>
                </div>
            </Combobox>
            <InputError id={error ? `${id}-error` : undefined} message={error} />
        </div>
    );
});

type FormDropdownOuterProps = FormDropdownProps & { ref?: React.Ref<HTMLInputElement> };

/**
 * Searchable dropdown for long option lists. Submits the selected **value** via a hidden input
 * (`name` / `value`) so it works with `FormData` and Inertia forms.
 */
export const FormDropdown = forwardRef<HTMLInputElement, FormDropdownOuterProps>(function FormDropdown(
    { resetKey, value, defaultValue, ...rest },
    ref,
) {
    const remountKey = [
        resetKey !== undefined ? String(resetKey) : '',
        defaultValue ?? '',
        value ?? '',
    ].join('|');

    return <FormDropdownInner key={remountKey} ref={ref} defaultValue={defaultValue} value={value} {...rest} />;
});
