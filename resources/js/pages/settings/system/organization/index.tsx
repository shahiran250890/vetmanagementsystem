import type { FormDataConvertible } from '@inertiajs/core';
import { Link, router, usePage } from '@inertiajs/react';
import type { FormEvent } from 'react';
import { useMemo, useState } from 'react';

import { FormDropdown } from '@/components/form-dropdown';
import { formPageSurfaceClassName, nativeTextareaClassName } from '@/components/form-page-layout';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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

const clinicTypeLabel: Record<OrganizationProfile['clinic_type'], string> = {
    vet: 'Veterinary clinic',
    human: 'Human clinic',
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'System Setting', href: systemHome() },
    { title: 'Organization Profile', href: organizationRoutes.edit() },
];

function displayValue(value?: string | null): string {
    if (!value) {
        return '-';
    }

    const normalized = value.trim();

    return normalized.length > 0 ? normalized : '-';
}

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
    const [formValues, setFormValues] = useState({
        clinic_type: organizationProfile?.clinic_type ?? '',
        organization_name: organizationProfile?.organization_name ?? '',
        organization_phone: organizationProfile?.organization_phone ?? '',
        organization_email: organizationProfile?.organization_email ?? '',
        organization_fax: organizationProfile?.organization_fax ?? '',
        organization_license: organizationProfile?.organization_license ?? '',
        organization_address: organizationProfile?.organization_address ?? '',
    });

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

    const profileOverview = [
        {
            label: 'Clinic type',
            value:
                formValues.clinic_type === 'vet' || formValues.clinic_type === 'human'
                    ? clinicTypeLabel[formValues.clinic_type]
                    : '-',
        },
        { label: 'Organization name', value: displayValue(formValues.organization_name) },
        { label: 'Phone', value: displayValue(formValues.organization_phone) },
        { label: 'Email', value: displayValue(formValues.organization_email) },
        { label: 'Fax', value: displayValue(formValues.organization_fax) },
        { label: 'License', value: displayValue(formValues.organization_license) },
        { label: 'Address', value: displayValue(formValues.organization_address) },
    ];

    return (
        <SystemLayout pageTitle="System Setting - Organization Profile" breadcrumbs={breadcrumbs}>
            <div className="space-y-4">
                <div>
                    <h2 className="text-lg font-semibold">Organization Profile</h2>
                    <p className="text-sm text-muted-foreground">
                        Manage your clinic identity and contact details used across modules and generated documents.
                    </p>
                </div>

                <div className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
                    <form
                        onSubmit={handleSubmit}
                        noValidate
                        className={cn(formPageSurfaceClassName, 'space-y-6')}
                    >
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-base font-semibold">Profile form</h3>
                                <p className="text-sm text-muted-foreground">
                                    Keep this information complete and up to date to avoid inaccurate records.
                                </p>
                            </div>

                            <div className="grid gap-2">
                                <FormDropdown
                                    id="clinic_type"
                                    name="clinic_type"
                                    label="Clinic Type"
                                    options={[
                                        { value: 'vet', label: 'Veterinary clinic' },
                                        { value: 'human', label: 'Human clinic' },
                                    ]}
                                    value={formValues.clinic_type}
                                    onValueChange={(value) => {
                                        setFormValues((prev) => ({ ...prev, clinic_type: value }));
                                    }}
                                    allowEmpty
                                    emptyOptionLabel="Select clinic type"
                                    placeholder="Select clinic type"
                                    disabled={!canUpdateSystemSetting}
                                    error={mergedErrors.clinic_type}
                                />
                            </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-2 sm:col-span-2">
                                <Label htmlFor="organization_name">Organization Name</Label>
                                <Input
                                    id="organization_name"
                                    name="organization_name"
                                    value={formValues.organization_name}
                                    onChange={(event) => {
                                        setFormValues((prev) => ({ ...prev, organization_name: event.target.value }));
                                    }}
                                    disabled={!canUpdateSystemSetting}
                                />
                                <InputError message={mergedErrors.organization_name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="organization_phone">Organization Phone</Label>
                                <Input
                                    id="organization_phone"
                                    name="organization_phone"
                                    value={formValues.organization_phone}
                                    onChange={(event) => {
                                        setFormValues((prev) => ({ ...prev, organization_phone: event.target.value }));
                                    }}
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
                                    value={formValues.organization_email}
                                    onChange={(event) => {
                                        setFormValues((prev) => ({ ...prev, organization_email: event.target.value }));
                                    }}
                                    disabled={!canUpdateSystemSetting}
                                />
                                <InputError message={mergedErrors.organization_email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="organization_fax">Organization Fax</Label>
                                <Input
                                    id="organization_fax"
                                    name="organization_fax"
                                    value={formValues.organization_fax}
                                    onChange={(event) => {
                                        setFormValues((prev) => ({ ...prev, organization_fax: event.target.value }));
                                    }}
                                    disabled={!canUpdateSystemSetting}
                                />
                                <InputError message={mergedErrors.organization_fax} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="organization_license">Organization License</Label>
                                <Input
                                    id="organization_license"
                                    name="organization_license"
                                    value={formValues.organization_license}
                                    onChange={(event) => {
                                        setFormValues((prev) => ({ ...prev, organization_license: event.target.value }));
                                    }}
                                    disabled={!canUpdateSystemSetting}
                                />
                                <InputError message={mergedErrors.organization_license} />
                            </div>

                            <div className="grid gap-2 sm:col-span-2">
                                <Label htmlFor="organization_address">Organization address (for letterhead)</Label>
                                <textarea
                                    id="organization_address"
                                    name="organization_address"
                                    rows={3}
                                    className={nativeTextareaClassName}
                                    value={formValues.organization_address}
                                    onChange={(event) => {
                                        setFormValues((prev) => ({ ...prev, organization_address: event.target.value }));
                                    }}
                                    disabled={!canUpdateSystemSetting}
                                    placeholder="Street, city, postcode"
                                />
                                <InputError message={mergedErrors.organization_address} />
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Button type="submit" disabled={!canUpdateSystemSetting || processing}>
                                Save organization
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href={systemHome()}>Back</Link>
                            </Button>
                        </div>
                    </form>

                    <Card className="h-fit">
                        <CardHeader>
                            <CardTitle>Profile view</CardTitle>
                            <CardDescription>
                                Quick summary of the current organization profile stored in the system.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {profileOverview.map((item) => (
                                <div key={item.label} className="grid grid-cols-[130px_minmax(0,1fr)] gap-3 text-sm">
                                    <p className="text-muted-foreground">{item.label}</p>
                                    <p className="break-words font-medium">{item.value}</p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </SystemLayout>
    );
}
