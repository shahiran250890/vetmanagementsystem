import { Form, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import ConfirmDeleteDialog from '@/components/confirm-delete-dialog';
import { formPageSurfaceClassName } from '@/components/form-page-layout';
import InputError from '@/components/input-error';
import { ListPageFilterActions } from '@/components/list-page-filter-actions';
import { ListPageFilters } from '@/components/list-page-filters';
import ListPagination from '@/components/system/list-pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SystemLayout from '@/layouts/settings/system-layout';
import { cn } from '@/lib/utils';
import { index as systemHome } from '@/routes/settings/system';
import rolesRoutes from '@/routes/settings/system/roles';
import type { BreadcrumbItem, PaginatedCollection } from '@/types';

type Permission = { id: number; name: string };
type Role = { id: number; name: string; permissions: Permission[] };
type PaginatedRoles = PaginatedCollection<Role>;
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'System Setting', href: systemHome() },
    { title: 'Role Management', href: rolesRoutes.index() },
];

export default function RolesIndex({ roles, permissions = [], editingRole, formMode, filters, canCreateRole, canUpdateRole, canDeleteRole }: { roles?: PaginatedRoles; permissions?: Permission[]; editingRole?: Role; formMode?: 'create' | 'edit'; filters?: { search?: string }; canCreateRole: boolean; canUpdateRole: boolean; canDeleteRole: boolean }) {
    const isEdit = formMode === 'edit' && editingRole;
    const isFormPage = formMode === 'create' || formMode === 'edit';
    const action = isEdit ? rolesRoutes.update.url(editingRole.id) : rolesRoutes.store.url();
    const selectedPermissionIds = new Set((editingRole?.permissions ?? []).map((permission) => permission.id));
    const [search, setSearch] = useState(filters?.search ?? '');
    const [selectedDeleteRole, setSelectedDeleteRole] = useState<Role | null>(null);
    const [deletingRoleId, setDeletingRoleId] = useState<number | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- sync applied server filters into local draft after Inertia navigation
        setSearch(filters?.search ?? '');
    }, [filters?.search]);

    const applyFilters = () => {
        router.get(
            rolesRoutes.index.url({ query: { search, page: 1 } }),
            {},
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const resetFilters = () => {
        setSearch('');
        router.get(
            rolesRoutes.index.url(),
            {},
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const goToPage = (page: number) => {
        router.get(
            rolesRoutes.index.url({ query: { search: filters?.search ?? '', page } }),
            {},
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const confirmDeleteRole = () => {
        if (!selectedDeleteRole || deletingRoleId !== null) {
            return;
        }

        setDeletingRoleId(selectedDeleteRole.id);

        router.delete(rolesRoutes.destroy.url(selectedDeleteRole.id), {
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
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-semibold">Role Management</h2>
                        <p className="text-sm text-muted-foreground">Configure roles and assign related permissions.</p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href={systemHome()}>Back to system setting</Link>
                    </Button>
                </div>
                {!isFormPage && (
                    <ListPageFilters>
                        <div className="grid w-full gap-4 md:grid-cols-[1fr_auto] md:items-end">
                            <div className="grid min-w-0 gap-2">
                                <Label htmlFor="role-search">Search</Label>
                                <Input
                                    id="role-search"
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder="Search role name"
                                />
                            </div>
                            <div className="flex flex-wrap items-end gap-2">
                                <ListPageFilterActions
                                    onApply={applyFilters}
                                    onReset={resetFilters}
                                />
                                {canCreateRole && (
                                    <Button asChild className="shrink-0">
                                        <Link href={rolesRoutes.create.url()}>Add role</Link>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </ListPageFilters>
                )}
                {isFormPage && (canCreateRole || canUpdateRole) && (
                    <Form
                        action={action}
                        method={isEdit ? 'put' : 'post'}
                        className={cn(formPageSurfaceClassName, 'space-y-4')}
                    >
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
                                        <Link href={rolesRoutes.index.url()}>Back</Link>
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
                                                    <Button className="bg-sky-600 text-white hover:bg-sky-700" asChild>
                                                        <Link href={rolesRoutes.show.url(role.id)}>View</Link>
                                                    </Button>
                                                    {canUpdateRole && (
                                                        <Button variant="outline" asChild>
                                                            <Link href={rolesRoutes.edit.url(role.id)}>Edit</Link>
                                                        </Button>
                                                    )}
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
                {!isFormPage && roles && (
                    <ListPagination
                        currentPage={roles.current_page}
                        lastPage={roles.last_page}
                        from={roles.from}
                        to={roles.to}
                        total={roles.total}
                        onPageChange={goToPage}
                    />
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
