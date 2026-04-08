import { Form, Head, Link, router } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import type { BreadcrumbItem } from '@/types';

type Permission = { id: number; name: string };
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'System Setting', href: '/settings/system' },
    { title: 'Permission Management', href: '/settings/system/permissions' },
];

export default function PermissionsIndex({ permissions, editingPermission, formMode = 'create', canCreatePermission, canUpdatePermission, canDeletePermission }: { permissions: Permission[]; editingPermission?: Permission; formMode?: 'create'|'edit'; canCreatePermission: boolean; canUpdatePermission: boolean; canDeletePermission: boolean }) {
    const isEdit = formMode === 'edit' && editingPermission;
    const action = isEdit ? `/settings/system/permissions/${editingPermission.id}` : '/settings/system/permissions';
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="System Setting - Permission Management" />
            <SettingsLayout>
                <div className="space-y-4">
                    {(canCreatePermission || canUpdatePermission) && (
                        <Form action={action} method={isEdit ? 'put' : 'post'} className="space-y-4 rounded border p-4">
                            {({ errors, processing }) => (
                                <>
                                    <div className="grid gap-2"><Label htmlFor="name">Name</Label><Input id="name" name="name" defaultValue={editingPermission?.name} /><InputError message={errors.name} /></div>
                                    <Button disabled={processing}>{isEdit ? 'Update' : 'Create'} permission</Button>
                                </>
                            )}
                        </Form>
                    )}
                    {permissions.map((permission) => (
                        <div key={permission.id} className="flex items-center justify-between rounded border p-3">
                            <p className="font-medium">{permission.name}</p>
                            <div className="flex gap-2">
                                {canUpdatePermission && <Button variant="outline" asChild><Link href={`/settings/system/permissions/${permission.id}/edit`}>Edit</Link></Button>}
                                {canDeletePermission && <Button variant="destructive" onClick={() => router.delete(`/settings/system/permissions/${permission.id}`)}>Delete</Button>}
                            </div>
                        </div>
                    ))}
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
