/**
 * Align with `App\Http\Requests\Settings\OrganizationProfileRequest` (subset).
 */

import { z } from 'zod';

export function parseOrganizationProfileFormData(formData: FormData): Record<string, string> {
    return {
        clinic_type: String(formData.get('clinic_type') ?? ''),
        organization_name: String(formData.get('organization_name') ?? ''),
        organization_phone: String(formData.get('organization_phone') ?? ''),
        organization_email: String(formData.get('organization_email') ?? ''),
        organization_fax: String(formData.get('organization_fax') ?? ''),
        organization_license: String(formData.get('organization_license') ?? ''),
        organization_address: String(formData.get('organization_address') ?? ''),
    };
}

export const organizationProfileFormSchema = z.object({
    clinic_type: z.enum(['vet', 'human']),
    organization_name: z.string().trim().min(1, 'Organization name is required.').max(255),
    organization_phone: z.string().trim().min(1, 'Organization phone is required.').max(50),
    organization_email: z.string().trim().email('Enter a valid organization email.').max(255),
    organization_fax: z.string().trim().min(1, 'Organization fax is required.').max(50),
    organization_license: z.string().trim().min(1, 'Organization license is required.').max(255),
    organization_address: z.string().trim().max(2000),
});

export type OrganizationProfileFormParsed = z.infer<typeof organizationProfileFormSchema>;
