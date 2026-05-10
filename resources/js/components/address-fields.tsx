import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useMemo, useState } from 'react';

import { FormInput } from '@/components/form-input';
import { nativeSelectClassName } from '@/components/form-page-layout';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export type NationalityOption = {
    id: number;
    name: string;
    iso3166_alpha2: string | null;
};

export type AddressFieldValues = {
    address_line_1?: string | null;
    address_line_2?: string | null;
    city?: string | null;
    state?: string | null;
    postcode?: string | null;
    country?: string | null;
};

type CountryComboOption = NationalityOption | { readonly id: -1; name: string; iso3166_alpha2: null };

function resolveCountrySelection(raw: string | null | undefined, nationalities: NationalityOption[]): CountryComboOption | null {
    const trimmed = raw?.trim() ?? '';

    if (trimmed === '') {
        return null;
    }

    const found = nationalities.find((n) => n.name === trimmed);

    if (found) {
        return found;
    }

    return { id: -1, name: trimmed, iso3166_alpha2: null };
}

function SearchableCountrySelect({
    nationalities,
    defaultCountry,
}: {
    nationalities: NationalityOption[];
    defaultCountry: string;
}) {
    const [query, setQuery] = useState('');
    const [selected, setSelected] = useState<CountryComboOption | null>(() =>
        resolveCountrySelection(defaultCountry, nationalities),
    );

    const optionRows = useMemo((): CountryComboOption[] => {
        const seen = new Set(nationalities.map((n) => n.name));
        const extra: CountryComboOption[] = [];

        if (selected && selected.id === -1 && !seen.has(selected.name)) {
            extra.push(selected);
        }

        return [...extra, ...nationalities];
    }, [nationalities, selected]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();

        if (q === '') {
            return optionRows;
        }

        return optionRows.filter((opt) => {
            if (opt.name.toLowerCase().includes(q)) {
                return true;
            }

            const code = opt.iso3166_alpha2?.toLowerCase() ?? '';

            return code.includes(q);
        });
    }, [optionRows, query]);

    return (
        <>
            <input type="hidden" name="country" value={selected?.name ?? ''} readOnly />
            <Combobox value={selected} onChange={setSelected} by="id" onClose={() => setQuery('')}>
                <div className="relative w-full">
                    <div className="flex w-full gap-1">
                        <ComboboxInput
                            id="country"
                            autoComplete="off"
                            displayValue={(item: CountryComboOption | null) => item?.name ?? ''}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Search country…"
                            className={cn(nativeSelectClassName, 'flex-1')}
                        />
                        <ComboboxButton
                            type="button"
                            className={cn(
                                nativeSelectClassName,
                                'inline-flex w-10 shrink-0 items-center justify-center px-0',
                            )}
                            aria-label="Open country list"
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
                            <div className="text-muted-foreground px-3 py-2 text-sm">No countries match your search.</div>
                        ) : (
                            filtered.map((opt) => (
                                <ComboboxOption
                                    key={opt.id === -1 ? `legacy-${opt.name}` : opt.id}
                                    value={opt}
                                    className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm data-focus:bg-accent data-selected:bg-accent/80"
                                >
                                    {({ selected: isSelected }) => (
                                        <>
                                            <span className="min-w-0 flex-1 truncate">{opt.name}</span>
                                            {opt.iso3166_alpha2 ? (
                                                <span className="text-muted-foreground shrink-0 text-xs uppercase">
                                                    {opt.iso3166_alpha2}
                                                </span>
                                            ) : null}
                                            {isSelected ? <Check className="text-primary size-4 shrink-0" /> : null}
                                        </>
                                    )}
                                </ComboboxOption>
                            ))
                        )}
                    </ComboboxOptions>
                </div>
            </Combobox>
        </>
    );
}

type AddressFieldsProps = {
    nationalities: NationalityOption[];
    errors: Record<string, string>;
    defaults?: AddressFieldValues;
    /** When true, country is a searchable list of nationality names; otherwise a text `<Input>`. */
    useNationalityCountrySelect?: boolean;
    /** Include in `SearchableCountrySelect` `key` so the country control resets when switching records (e.g. staff id). */
    countrySelectResetKey?: string | number;
    className?: string;
};

/**
 * Structured mailing address (lines, locality, country).
 * Country options come from the tenant `nationalities` table (seeded reference list).
 */
export function AddressFields({
    nationalities,
    errors,
    defaults,
    useNationalityCountrySelect = true,
    countrySelectResetKey,
    className,
}: AddressFieldsProps) {
    const rawCountry = defaults?.country?.trim() ?? '';
    const countryComboKey = [
        countrySelectResetKey !== undefined ? String(countrySelectResetKey) : '',
        rawCountry,
        nationalities.length,
    ].join('|');

    return (
        <div className={cn('grid gap-4 sm:grid-cols-2', className)}>
            <div className="sm:col-span-2">
                <FormInput
                    label="Address line 1"
                    name="address_line_1"
                    defaultValue={defaults?.address_line_1 ?? ''}
                    error={errors.address_line_1}
                />
            </div>
            <div className="sm:col-span-2">
                <FormInput
                    label="Address line 2"
                    name="address_line_2"
                    defaultValue={defaults?.address_line_2 ?? ''}
                    error={errors.address_line_2}
                />
            </div>
            <FormInput label="City" name="city" defaultValue={defaults?.city ?? ''} error={errors.city} />
            <FormInput label="State / region" name="state" defaultValue={defaults?.state ?? ''} error={errors.state} />
            <FormInput label="Postcode" name="postcode" defaultValue={defaults?.postcode ?? ''} error={errors.postcode} />
            <div className="grid gap-2">
                {useNationalityCountrySelect ? (
                    <>
                        <Label htmlFor="country">Country</Label>
                        <SearchableCountrySelect
                            key={countryComboKey}
                            nationalities={nationalities}
                            defaultCountry={rawCountry}
                        />
                        <InputError message={errors.country} />
                    </>
                ) : (
                    <FormInput label="Country" name="country" defaultValue={defaults?.country ?? ''} error={errors.country} />
                )}
            </div>
        </div>
    );
}
