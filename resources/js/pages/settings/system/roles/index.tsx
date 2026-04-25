import { Form, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import ConfirmDeleteDialog from '@/components/confirm-delete-dialog';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SystemLayout from '@/layouts/settings/system-layout';
import type { BreadcrumbItem } from '@/types';

type Permission = { id: number; name: string };
type Role = { id: number; name: string; permissions: Permission[] };
type PaginatedRoles = {
    data: Role[];
    current_page: number;
    last_page: number;
    total: number;
    from: number | null;
    to: number | null;
};
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'System Setting', href: '/settings/system' },
    { title: 'Role Management', href: '/settings/system/roles' },
];

export default function RolesIndex({ roles, permissions = [], editingRole, formMode, filters, canCreateRole, canUpdateRole, canDeleteRole }: { roles?: PaginatedRoles; permissions?: Permission[]; editingRole?: Role; formMode?: 'create' | 'edit'; filters?: { search?: string }; canCreateRole: boolean; canUpdateRole: boolean; canDeleteRole: boolean }) {
    const isEdit = formMode === 'edit' && editingRole;
    const isFormPage = formMode === 'create' || formMode === 'edit';
    const action = isEdit ? `/settings/system/roles/${editingRole.id}` : '/settings/system/roles';
    const selectedPermissionIds = new Set((editingRole?.permissions ?? []).map((permission) => permission.id));
    const [search, setSearch] = useState(filters?.search ?? '');
    const [debouncedSearch, setDebouncedSearch] = useState(filters?.search ?? '');
    const [selectedDeleteRole, setSelectedDeleteRole] = useState<Role | null>(null);
    const [deletingRoleId, setDeletingRoleId] = useState<number | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedSearch(search);
        }, 300);

        return () => clearTimeout(timeout);
    }, [search]);

    useEffect(() => {
        if (isFormPage || debouncedSearch === (filters?.search ?? '')) {
            return;
        }

        router.get('/settings/system/roles', { search: debouncedSearch, page: 1 }, { preserveState: true, preserveScroll: true, replace: true });
    }, [debouncedSearch, filters?.search, isFormPage]);

    const goToPage = (page: number) => {
        router.get('/settings/system/roles', { search: filters?.search ?? '', page }, { preserveState: true, preserveScroll: true, replace: true });
    };

    const confirmDeleteRole = () => {
        if (!selectedDeleteRole || deletingRoleId !== null) {
            return;
        }

        setDeletingRoleId(selectedDeleteRole.id);

        router.delete(`/settings/system/roles/${selectedDeleteRole.id}`, {
            preserveScroll: true,
            preserveState: true,
            onError: (errors) => {
                setDeleteError(errors.delete ?? 'Unable to delete this role.');
            },
            onSuccess: () => {
                setSelectedDeleteRole(null);
                setDeleteError(null);
            },
            onFinish: () => {
                setDeletingRoleId(null);
            },
        });
    };

    return (
        <SystemLayout pageTitle="System Setting - Role Management" breadcrumbs={breadcrumbs}>
            <div className="space-y-4">
                {canCreateRole && !isFormPage && (
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex flex-1 items-center gap-2">
                            <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search role name" />
                        </div>
                        <Button asChild>
                            <Link href="/settings/system/roles/create">Add role</Link>
                        </Button>
                    </div>
                )}
                {isFormPage && (canCreateRole || canUpdateRole) && (
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
                                <div className="flex gap-2">
                                    <Button disabled={processing}>{isEdit ? 'Update' : 'Create'}</Button>
                                    <Button variant="outline" asChild>
                                        <Link href="/settings/system/roles">Back</Link>
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                )}
                {!isFormPage && (
                    <div className="overflow-x-auto rounded-lg border">
                        <table className="w-full min-w-[900px] text-left text-sm">
                            <thead className="bg-muted/30">
                                <tr>
                                    <th className="px-4 py-3">Role</th>
                                    <th className="px-4 py-3">Permissions</th>
                                    <th className="px-4 py-3">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {roles?.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">
                                            No roles found.
                                        </td>
                                    </tr>
                                ) : (
                                    roles?.data.map((role) => (
                                        <tr key={role.id} className="border-t">
                                            <td className="px-4 py-3 font-medium">{role.name}</td>
                                            <td className="px-4 py-3 text-muted-foreground">{role.permissions.map((permission) => permission.name).join(', ') || 'No permissions'}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex gap-2">
                                                    {canUpdateRole && <Button variant="outline" asChild><Link href={`/settings/system/roles/${role.id}/edit`}>Edit</Link></Button>}
                                                    {canDeleteRole && (
                                                        <Button
                                                            variant="destructive"
                                                            type="button"
                                                            disabled={deletingRoleId !== null}
                                                            onClick={() => {
                                                                setDeleteError(null);
                                                                setSelectedDeleteRole(role);
                                                            }}
                                                        >
                                                            Delete
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
                {!isFormPage && roles && roles.last_page > 1 && (
                    <div className="flex items-center justify-between rounded border px-4 py-3 text-sm">
                        <p className="text-muted-foreground">
                            Showing {roles.from ?? 0} to {roles.to ?? 0} of {roles.total}
                        </p>
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                disabled={roles.current_page <= 1}
                                onClick={() => goToPage(roles.current_page - 1)}
                            >
                                Previous
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                disabled={roles.current_page >= roles.last_page}
                                onClick={() => goToPage(roles.current_page + 1)}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </div>
            <ConfirmDeleteDialog
                open={selectedDeleteRole !== null}
                title="Delete role"
                description={selectedDeleteRole
                    ? `Are you sure you want to delete ${selectedDeleteRole.name}? This action cannot be undone.`
                    : ''}
                errorMessage={deleteError ?? undefined}
                processing={deletingRoleId !== null}
                onOpenChange={(open) => {
                    if (!open && deletingRoleId === null) {
                        setSelectedDeleteRole(null);
                        setDeleteError(null);
                    }
                }}
                onCancel={() => {
                    setSelectedDeleteRole(null);
                    setDeleteError(null);
                }}
                onConfirm={confirmDeleteRole}
            />
        </SystemLayout>
    );
}
