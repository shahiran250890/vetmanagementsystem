import { Form, Head, Link, router } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import type { BreadcrumbItem } from '@/types';

type Permission = { id: number; name: string };
type Role = { id: number; name: string; permissions: Permission[] };
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'System Setting', href: '/settings/system' },
    { title: 'Role Management', href: '/settings/system/roles' },
];

export default function RolesIndex({ roles, permissions, editingRole, formMode = 'create', canCreateRole, canUpdateRole, canDeleteRole }: { roles: Role[]; permissions: Permission[]; editingRole?: Role; formMode?: 'create'|'edit'; canCreateRole: boolean; canUpdateRole: boolean; canDeleteRole: boolean }) {
    const isEdit = formMode === 'edit' && editingRole;
    const action = isEdit ? `/settings/system/roles/${editingRole.id}` : '/settings/system/roles';
    const selectedPermissionIds = new Set((editingRole?.permissions ?? []).map((permission) => permission.id));
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="System Setting - Role Management" />
            <SettingsLayout>
                <div className="space-y-4">
                    {(canCreateRole || canUpdateRole) && (
                        <Form action={action} method={isEdit ? 'put' : 'post'} className="space-y-4 rounded border p-4">
                            {({ errors, processing }) => (
                                <>
                                    <div className="grid gap-2"><Label htmlFor="name">Name</Label><Input id="name" name="name" defaultValue={editingRole?.name} /><InputError message={errors.name} /></div>
                                    <div className="grid gap-2">
                                        <Label>Permissions</Label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {permissions.map((permission) => <label key={permission.id} className="flex items-center gap-2 text-sm"><input type="checkbox" name="permission_ids[]" value={permission.id} defaultChecked={selectedPermissionIds.has(permission.id)} />{permission.name}</label>)}
                                        </div>
                                    </div>
                                    <Button disabled={processing}>{isEdit ? 'Update' : 'Create'} role</Button>
                                </>
                            )}
                        </Form>
                    )}
                    {roles.map((role) => (
                        <div key={role.id} className="flex items-center justify-between rounded border p-3">
                            <div><p className="font-medium">{role.name}</p><p className="text-sm text-muted-foreground">{role.permissions.map((permission) => permission.name).join(', ') || 'No permissions'}</p></div>
                            <div className="flex gap-2">
                                {canUpdateRole && <Button variant="outline" asChild><Link href={`/settings/system/roles/${role.id}/edit`}>Edit</Link></Button>}
                                {canDeleteRole && <Button variant="destructive" onClick={() => router.delete(`/settings/system/roles/${role.id}`)}>Delete</Button>}
                            </div>
                        </div>
                    ))}
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
