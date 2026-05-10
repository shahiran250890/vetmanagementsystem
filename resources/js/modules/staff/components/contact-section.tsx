import { AddressFields } from '@/components/address-fields';
import type { NationalityOption } from '@/components/address-fields';
import { FormInput } from '@/components/form-input';

import type { StaffMember } from '../types';

export function ContactSection({
    managedStaff,
    errors,
    nationalities,
}: {
    managedStaff?: StaffMember;
    errors: Record<string, string>;
    nationalities: NationalityOption[];
}) {
    return (
        <div className="grid gap-4 sm:grid-cols-2">
            <FormInput
                label="Mobile number"
                name="mobile_number"
                defaultValue={managedStaff?.mobile_number ?? ''}
                error={errors.mobile_number}
            />
            <FormInput label="Alternate number" name="alternate_phone" defaultValue={managedStaff?.alternate_phone ?? ''} />
            <div className="sm:col-span-2">
                <FormInput
                    label="Work / contact email"
                    name="email"
                    type="email"
                    defaultValue={managedStaff?.email ?? ''}
                    error={errors.email}
                />
            </div>

            <div className="sm:col-span-2">
                <AddressFields
                    nationalities={nationalities}
                    errors={errors}
                    countrySelectResetKey={managedStaff?.id ?? 'create'}
                    defaults={{
                        address_line_1: managedStaff?.address_line_1,
                        address_line_2: managedStaff?.address_line_2,
                        city: managedStaff?.city,
                        state: managedStaff?.state,
                        postcode: managedStaff?.postcode,
                        country: managedStaff?.country,
                    }}
                />
            </div>

            <div className="grid gap-4 sm:col-span-2 sm:grid-cols-2">
                <FormInput
                    label="Emergency contact name"
                    name="emergency_contact_name"
                    defaultValue={managedStaff?.emergency_contact_name ?? ''}
                    error={errors.emergency_contact_name}
                />
                <FormInput
                    label="Emergency contact phone"
                    name="emergency_contact_phone"
                    defaultValue={managedStaff?.emergency_contact_phone ?? ''}
                    error={errors.emergency_contact_phone}
                />
            </div>
        </div>
    );
}
