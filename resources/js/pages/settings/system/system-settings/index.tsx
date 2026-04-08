import { Form, Head, Link, router } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import type { BreadcrumbItem } from '@/types';

type Setting = { id: number; key: string; label: string; value: string | null; is_enabled: boolean };

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'System Setting', href: '/settings/system' },
    { title: 'System Settings', href: '/settings/system/system-settings' },
];

export default function SystemSettingsIndex({
    settings, editingSetting, formMode = 'create', canCreateSystemSetting, canUpdateSystemSetting, canDeleteSystemSetting,
}: {
    settings: Setting[]; editingSetting?: Setting; formMode?: 'create' | 'edit';
    canCreateSystemSetting: boolean; canUpdateSystemSetting: boolean; canDeleteSystemSetting: boolean;
}) {
    const isEdit = formMode === 'edit' && editingSetting;
    const action = isEdit ? `/settings/system/system-settings/${editingSetting.id}` : '/settings/system/system-settings';
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="System Setting - System Settings" />
            <SettingsLayout>
                <div className="space-y-6">
                    {(canCreateSystemSetting || canUpdateSystemSetting) && (
                        <Form action={action} method={isEdit ? 'put' : 'post'} className="space-y-4 rounded border p-4">
                            {({ errors, processing }) => (
                                <>
                                    <div className="grid gap-2"><Label htmlFor="key">Key</Label><Input id="key" name="key" defaultValue={editingSetting?.key} /><InputError message={errors.key} /></div>
                                    <div className="grid gap-2"><Label htmlFor="label">Label</Label><Input id="label" name="label" defaultValue={editingSetting?.label} /><InputError message={errors.label} /></div>
                                    <div className="grid gap-2"><Label htmlFor="value">Value</Label><Input id="value" name="value" defaultValue={editingSetting?.value ?? ''} /><InputError message={errors.value} /></div>
                                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="is_enabled" value="1" defaultChecked={editingSetting?.is_enabled ?? true} /> Enabled</label>
                                    <Button disabled={processing}>{isEdit ? 'Update' : 'Create'} setting</Button>
                                </>
                            )}
                        </Form>
                    )}
                    <div className="space-y-2">
                        {settings.map((setting) => (
                            <div key={setting.id} className="flex items-center justify-between rounded border p-3">
                                <div><p className="font-medium">{setting.label}</p><p className="text-sm text-muted-foreground">{setting.key}</p></div>
                                <div className="flex gap-2">
                                    {canUpdateSystemSetting && <Button variant="outline" asChild><Link href={`/settings/system/system-settings/${setting.id}/edit`}>Edit</Link></Button>}
                                    {canDeleteSystemSetting && <Button variant="destructive" onClick={() => router.delete(`/settings/system/system-settings/${setting.id}`)}>Delete</Button>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
