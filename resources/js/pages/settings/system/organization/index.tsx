import type { FormDataConvertible } from '@inertiajs/core';
import { Link, router, usePage } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { useMemo, useState } from 'react';

import { FormDropdown } from '@/components/form-dropdown';
import { formPageSurfaceClassName, nativeTextareaClassName } from '@/components/form-page-layout';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SystemLayout from '@/layouts/settings/system-layout';
import {
    organizationProfileFormSchema,
    parseOrganizationProfileFormData,
} from '@/lib/organization-profile-form-schema';
import { stripUndefinedPayload } from '@/lib/strip-undefined-payload';
import { cn } from '@/lib/utils';
import { zodIssuesToDotRecord } from '@/lib/zod-error-map';
import { index as systemHome } from '@/routes/settings/system';
import organizationRoutes from '@/routes/settings/system/organization';
import type { BreadcrumbItem } from '@/types';

type OrganizationProfile = {
    clinic_type: 'vet' | 'human';
    organization_name: string;
    organization_phone: string;
    organization_email: string;
    organization_fax: string;
    organization_license: string;
    organization_address?: string | null;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'System Setting', href: systemHome() },
    { title: 'Organization Profile', href: organizationRoutes.edit() },
];

function normalizePageErrors(raw: unknown): Record<string, string> {
    if (!raw || typeof raw !== 'object') {
        return {};
    }

    const out: Record<string, string> = {};

    for (const [key, value] of Object.entries(raw)) {
        if (typeof value === 'string') {
            out[key] = value;
        } else if (Array.isArray(value) && typeof value[0] === 'string') {
            out[key] = value[0];
        }
    }

    return out;
}

export default function OrganizationProfilePage({
    organizationProfile,
    canUpdateSystemSetting,
}: {
    organizationProfile?: OrganizationProfile | null;
    canUpdateSystemSetting: boolean;
}) {
    const page = usePage<{ errors?: Record<string, unknown> }>();
    const serverErrors = useMemo(() => normalizePageErrors(page.props.errors), [page.props.errors]);
    const [clientErrors, setClientErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);

    const mergedErrors = useMemo(
        () => ({ ...serverErrors, ...clientErrors }),
        [serverErrors, clientErrors],
    );

    const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();

        if (!canUpdateSystemSetting) {
            return;
        }

        const parsed = parseOrganizationProfileFormData(new FormData(event.currentTarget));
        const result = organizationProfileFormSchema.safeParse(parsed);

        if (!result.success) {
            setClientErrors(zodIssuesToDotRecord(result.error));

            return;
        }

        setClientErrors({});

        const payload = stripUndefinedPayload(
            result.data as unknown as Record<string, FormDataConvertible | undefined>,
        );

        setProcessing(true);

        router.put(organizationRoutes.update.url(), payload, {
            preserveScroll: true,
            onFinish: (): void => {
                setProcessing(false);
            },
        });
    };

    return (
        <SystemLayout pageTitle="System Setting - Organization Profile" breadcrumbs={breadcrumbs}>
            <div className="max-w-3xl space-y-4">
                <div>
                    <h2 className="text-lg font-semibold">Organization Profile</h2>
                    <p className="text-sm text-muted-foreground">Define your clinic type and organization details.</p>
                </div>
                <form
                    onSubmit={handleSubmit}
                    noValidate
                    className={cn(formPageSurfaceClassName, 'space-y-4')}
                >
                    <div className="grid gap-2">
                        <FormDropdown
                            id="clinic_type"
                            name="clinic_type"
                            label="Clinic Type"
                            options={[
                                { value: 'vet', label: 'Veterinary clinic' },
                                { value: 'human', label: 'Human clinic' },
                            ]}
                            defaultValue={organizationProfile?.clinic_type ?? ''}
                            allowEmpty
                            emptyOptionLabel="Select clinic type"
                            placeholder="Select clinic type"
                            disabled={!canUpdateSystemSetting}
                            error={mergedErrors.clinic_type}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="organization_name">Organization Name</Label>
                        <Input
                            id="organization_name"
                            name="organization_name"
                            defaultValue={organizationProfile?.organization_name ?? ''}
                            disabled={!canUpdateSystemSetting}
                        />
                        <InputError message={mergedErrors.organization_name} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="organization_phone">Organization Phone</Label>
                        <Input
                            id="organization_phone"
                            name="organization_phone"
                            defaultValue={organizationProfile?.organization_phone ?? ''}
                            disabled={!canUpdateSystemSetting}
                        />
                        <InputError message={mergedErrors.organization_phone} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="organization_email">Organization Email</Label>
                        <Input
                            id="organization_email"
                            name="organization_email"
                            type="email"
                            defaultValue={organizationProfile?.organization_email ?? ''}
                            disabled={!canUpdateSystemSetting}
                        />
                        <InputError message={mergedErrors.organization_email} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="organization_fax">Organization Fax</Label>
                        <Input
                            id="organization_fax"
                            name="organization_fax"
                            defaultValue={organizationProfile?.organization_fax ?? ''}
                            disabled={!canUpdateSystemSetting}
                        />
                        <InputError message={mergedErrors.organization_fax} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="organization_license">Organization License</Label>
                        <Input
                            id="organization_license"
                            name="organization_license"
                            defaultValue={organizationProfile?.organization_license ?? ''}
                            disabled={!canUpdateSystemSetting}
                        />
                        <InputError message={mergedErrors.organization_license} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="organization_address">Organization address (for letterhead)</Label>
                        <textarea
                            id="organization_address"
                            name="organization_address"
                            rows={3}
                            className={nativeTextareaClassName}
                            defaultValue={organizationProfile?.organization_address ?? ''}
                            disabled={!canUpdateSystemSetting}
                            placeholder="Street, city, postcode"
                        />
                        <InputError message={mergedErrors.organization_address} />
                    </div>
                    <div className="flex gap-2">
                        <Button type="submit" disabled={!canUpdateSystemSetting || processing}>
                            Save organization
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href={systemHome()}>Back</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </SystemLayout>
    );
}
