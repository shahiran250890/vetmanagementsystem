import { useState } from 'react';

import { FormInput } from '@/components/form-input';
import { GenderSelection } from '@/components/gender-selection';
import InputError from '@/components/input-error';
import { normalizeGenderSelectValue } from '@/lib/gender-selection';

import type { StaffMember } from '../types';

export function PersonalInformationSection({
    managedStaff,
    errors,
    isEdit,
}: {
    managedStaff?: StaffMember;
    errors: Record<string, string>;
    isEdit: boolean;
}) {
    const [staffNumberSource, setStaffNumberSource] = useState<'auto' | 'manual'>('auto');

    if (isEdit) {
        return (
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                    <FormInput
                        label="Staff number"
                        name="staff_number"
                        readOnly
                        defaultValue={managedStaff?.staff_number ?? ''}
                        className="bg-muted"
                        error={errors.staff_number}
                    />
                </div>
                <FormInput
                    label="Full name *"
                    name="full_name"
                    aria-required="true"
                    defaultValue={managedStaff?.full_name ?? ''}
                    error={errors.full_name}
                />
                <FormInput label="Preferred name" name="preferred_name" defaultValue={managedStaff?.preferred_name ?? ''} />
                <FormInput label="NRIC / Passport" name="nric_passport" defaultValue={managedStaff?.nric_passport ?? ''} />
                <GenderSelection
                    id="gender"
                    name="gender"
                    label="Sex"
                    defaultValue={normalizeGenderSelectValue(managedStaff?.gender)}
                    error={errors.gender}
                />
                <FormInput
                    label="Date of birth"
                    name="date_of_birth"
                    type="date"
                    defaultValue={managedStaff?.date_of_birth ?? ''}
                />
                <FormInput label="Nationality" name="nationality" defaultValue={managedStaff?.nationality ?? ''} />
                <FormInput label="Marital status" name="marital_status" defaultValue={managedStaff?.marital_status ?? ''} />
                <div className="space-y-1 sm:col-span-2">
                    <FormInput
                        label="Photo URL"
                        name="photo_path"
                        placeholder="https://…"
                        defaultValue={managedStaff?.photo_path ?? ''}
                        error={errors.photo_path}
                    />
                    <p className="text-muted-foreground text-xs">
                        Upload workflow can be wired to storage later — paste an image URL for now.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2">
            <fieldset className="grid gap-3 sm:col-span-2">
                <legend className="text-sm font-medium">Staff number</legend>
                <p className="text-muted-foreground -mt-1 text-xs">Generate automatically or enter an existing format used by your clinic.</p>
                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-6">
                    <label className="flex cursor-pointer items-center gap-2 text-sm">
                        <input
                            type="radio"
                            name="staff_number_source"
                            value="auto"
                            checked={staffNumberSource === 'auto'}
                            onChange={() => setStaffNumberSource('auto')}
                            className="border-input text-primary"
                        />
                        Generate automatically
                    </label>
                    <label className="flex cursor-pointer items-center gap-2 text-sm">
                        <input
                            type="radio"
                            name="staff_number_source"
                            value="manual"
                            checked={staffNumberSource === 'manual'}
                            onChange={() => setStaffNumberSource('manual')}
                            className="border-input text-primary"
                        />
                        Enter manually
                    </label>
                </div>
                <InputError message={errors.staff_number_source} />
                {staffNumberSource === 'manual' ? (
                    <div className="max-w-md">
                        <FormInput
                            label="Staff number *"
                            name="staff_number"
                            aria-required="true"
                            autoComplete="off"
                            placeholder="e.g. STF-00123"
                            error={errors.staff_number}
                        />
                    </div>
                ) : (
                    <p className="text-muted-foreground text-xs">
                        A unique staff number (for example STF-00042) will be assigned when you save.
                    </p>
                )}
            </fieldset>
            <FormInput
                label="Full name *"
                name="full_name"
                aria-required="true"
                defaultValue={managedStaff?.full_name ?? ''}
                error={errors.full_name}
            />
            <FormInput label="Preferred name" name="preferred_name" defaultValue={managedStaff?.preferred_name ?? ''} />
            <FormInput label="NRIC / Passport" name="nric_passport" defaultValue={managedStaff?.nric_passport ?? ''} />
            <GenderSelection
                id="gender"
                name="gender"
                label="Sex"
                defaultValue={normalizeGenderSelectValue(managedStaff?.gender)}
                error={errors.gender}
            />
            <FormInput
                label="Date of birth"
                name="date_of_birth"
                type="date"
                defaultValue={managedStaff?.date_of_birth ?? ''}
            />
            <FormInput label="Nationality" name="nationality" defaultValue={managedStaff?.nationality ?? ''} />
            <FormInput label="Marital status" name="marital_status" defaultValue={managedStaff?.marital_status ?? ''} />
            <div className="space-y-1 sm:col-span-2">
                <FormInput
                    label="Photo URL"
                    name="photo_path"
                    placeholder="https://…"
                    defaultValue={managedStaff?.photo_path ?? ''}
                    error={errors.photo_path}
                />
                <p className="text-muted-foreground text-xs">
                    Upload workflow can be wired to storage later — paste an image URL for now.
                </p>
            </div>
        </div>
    );
}
