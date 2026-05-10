import { FormInput } from '@/components/form-input';
import { nativeTextareaClassName } from '@/components/form-page-layout';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

import type { StaffMember } from '../types';

export function ProfessionalSection({
    managedStaff,
    errors,
}: {
    managedStaff?: StaffMember;
    errors: Record<string, string>;
}) {
    return (
        <div className="grid gap-4 sm:grid-cols-2">
            <FormInput
                label="Medical council registration no."
                name="medical_registration_number"
                defaultValue={managedStaff?.medical_registration_number ?? ''}
                error={errors.medical_registration_number}
            />
            <FormInput
                label="Annual practising certificate (APC)"
                name="apc_number"
                defaultValue={managedStaff?.apc_number ?? ''}
                error={errors.apc_number}
            />
            <FormInput
                label="APC expiry"
                name="apc_expiry_date"
                type="date"
                defaultValue={managedStaff?.apc_expiry_date ?? ''}
                error={errors.apc_expiry_date}
            />
            <FormInput
                label="Specialization"
                name="specialization"
                defaultValue={managedStaff?.specialization ?? ''}
                error={errors.specialization}
            />
            <FormInput
                label="Years of experience"
                name="years_experience"
                type="number"
                min={0}
                max={80}
                defaultValue={managedStaff?.years_experience ?? ''}
                error={errors.years_experience}
            />
            <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="qualifications">Qualifications</Label>
                <textarea
                    id="qualifications"
                    name="qualifications"
                    rows={4}
                    defaultValue={managedStaff?.qualifications ?? ''}
                    className={cn(nativeTextareaClassName, 'min-h-24')}
                />
                <InputError message={errors.qualifications} />
            </div>
        </div>
    );
}
