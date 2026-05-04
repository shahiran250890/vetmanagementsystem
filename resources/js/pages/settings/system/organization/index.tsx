import { Form, Link } from '@inertiajs/react';
import { formPageSurfaceClassName } from '@/components/form-page-layout';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SystemLayout from '@/layouts/settings/system-layout';
import { cn } from '@/lib/utils';
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
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'System Setting', href: systemHome() },
    { title: 'Organization Profile', href: organizationRoutes.edit() },
];

export default function OrganizationProfilePage({
    organizationProfile,
    canUpdateSystemSetting,
}: {
    organizationProfile?: OrganizationProfile | null;
    canUpdateSystemSetting: boolean;
}) {
    return (
        <SystemLayout pageTitle="System Setting - Organization Profile" breadcrumbs={breadcrumbs}>
            <div className="max-w-3xl space-y-4">
                <div>
                    <h2 className="text-lg font-semibold">Organization Profile</h2>
                    <p className="text-sm text-muted-foreground">Define your clinic type and organization details.</p>
                </div>
                <Form
                    action={organizationRoutes.update.url()}
                    method="put"
                    className={cn(formPageSurfaceClassName, 'space-y-4')}
                >
                    {({ errors, processing }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="clinic_type">Clinic Type</Label>
                                <select
                                    id="clinic_type"
                                    name="clinic_type"
                                    defaultValue={organizationProfile?.clinic_type ?? ''}
                                    className="h-10 rounded-md border bg-background px-3 text-sm"
                                    disabled={!canUpdateSystemSetting}
                                >
                                    <option value="" disabled>
                                        Select clinic type
                                    </option>
                                    <option value="vet">Veterinary clinic</option>
                                    <option value="human">Human clinic</option>
                                </select>
                                <InputError message={errors.clinic_type} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="organization_name">Organization Name</Label>
                                <Input id="organization_name" name="organization_name" defaultValue={organizationProfile?.organization_name ?? ''} disabled={!canUpdateSystemSetting} />
                                <InputError message={errors.organization_name} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="organization_phone">Organization Phone</Label>
                                <Input id="organization_phone" name="organization_phone" defaultValue={organizationProfile?.organization_phone ?? ''} disabled={!canUpdateSystemSetting} />
                                <InputError message={errors.organization_phone} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="organization_email">Organization Email</Label>
                                <Input id="organization_email" name="organization_email" type="email" defaultValue={organizationProfile?.organization_email ?? ''} disabled={!canUpdateSystemSetting} />
                                <InputError message={errors.organization_email} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="organization_fax">Organization Fax</Label>
                                <Input id="organization_fax" name="organization_fax" defaultValue={organizationProfile?.organization_fax ?? ''} disabled={!canUpdateSystemSetting} />
                                <InputError message={errors.organization_fax} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="organization_license">Organization License</Label>
                                <Input id="organization_license" name="organization_license" defaultValue={organizationProfile?.organization_license ?? ''} disabled={!canUpdateSystemSetting} />
                                <InputError message={errors.organization_license} />
                            </div>
                            <div className="flex gap-2">
                                <Button disabled={!canUpdateSystemSetting || processing}>Save organization</Button>
                                <Button variant="outline" asChild>
                                    <Link href={systemHome()}>Back</Link>
                                </Button>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </SystemLayout>
    );
}
