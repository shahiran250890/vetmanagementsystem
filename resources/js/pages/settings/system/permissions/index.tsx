import { Form, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import ConfirmDeleteDialog from '@/components/confirm-delete-dialog';
import { formPageSurfaceClassName } from '@/components/form-page-layout';
import InputError from '@/components/input-error';
import { ListPageFilterActions } from '@/components/list-page-filter-actions';
import { ListPageFilters } from '@/components/list-page-filters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SystemLayout from '@/layouts/settings/system-layout';
import { cn } from '@/lib/utils';
import { index as systemHome } from '@/routes/settings/system';
import type { BreadcrumbItem } from '@/types';

type Permission = { id: number; name: string };
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'System Setting', href: '/settings/system' },
    { title: 'Permission Management', href: '/settings/system/permissions' },
];

export default function PermissionsIndex({ permissions, editingPermission, formMode, filters, canCreatePermission, canUpdatePermission, canDeletePermission }: { permissions: Permission[]; editingPermission?: Permission; formMode?: 'create'|'edit'; filters?: { search?: string }; canCreatePermission: boolean; canUpdatePermission: boolean; canDeletePermission: boolean }) {
    const isEdit = formMode === 'edit' && editingPermission;
    const isFormPage = formMode === 'create' || formMode === 'edit';
    const action = isEdit ? `/settings/system/permissions/${editingPermission.id}` : '/settings/system/permissions';
    const [search, setSearch] = useState(filters?.search ?? '');
    const [selectedDeletePermission, setSelectedDeletePermission] = useState<Permission | null>(null);
    const [deletingPermissionId, setDeletingPermissionId] = useState<number | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- sync applied server filters into local draft after Inertia navigation
        setSearch(filters?.search ?? '');
    }, [filters?.search]);

    const applyFilters = () => {
        router.get(
            '/settings/system/permissions',
            { search, page: 1 },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const resetFilters = () => {
        setSearch('');
        router.get(
            '/settings/system/permissions',
            {},
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const openDeleteDialog = (permission: Permission) => {
        if (!canDeletePermission || deletingPermissionId !== null) {
            return;
        }

        setDeleteError(null);
        setSelectedDeletePermission(permission);
    };

    const confirmDeletePermission = () => {
        if (!selectedDeletePermission || !canDeletePermission || deletingPermissionId !== null) {
            return;
        }

        setDeletingPermissionId(selectedDeletePermission.id);

        router.delete(`/settings/system/permissions/${selectedDeletePermission.id}`, {
            preserveScroll: true,
            preserveState: true,
            onError: (errors) => {
                setDeleteError(errors.delete ?? 'Unable to delete this permission.');
            },
            onSuccess: () => {
                setSelectedDeletePermission(null);
                setDeleteError(null);
            },
            onFinish: () => {
                setDeletingPermissionId(null);
            },
        });
    };

    return (
        <SystemLayout pageTitle="System Setting - Permission Management" breadcrumbs={breadcrumbs}>
            <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-semibold">Permission Management</h2>
                        <p className="text-sm text-muted-foreground">
                            Manage permission keys used in access control rules.
                        </p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href={systemHome()}>Back to system setting</Link>
                    </Button>
                </div>
                {!isFormPage && (
                    <ListPageFilters>
                        <div className="grid w-full gap-4 md:grid-cols-[1fr_auto] md:items-end">
                            <div className="grid min-w-0 gap-2">
                                <Label htmlFor="permission-search">Search</Label>
                                <Input
                                    id="permission-search"
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder="Search permission name"
                                />
                            </div>
                            <div className="flex flex-wrap items-end gap-2">
                                <ListPageFilterActions
                                    onApply={applyFilters}
                                    onReset={resetFilters}
                                />
                                {canCreatePermission && (
                                    <Button asChild className="shrink-0">
                                        <Link href="/settings/system/permissions/create">
                                            Add permission
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </ListPageFilters>
                )}
                {isFormPage && (canCreatePermission || canUpdatePermission) && (
                    <Form
                        action={action}
                        method={isEdit ? 'put' : 'post'}
                        className={cn(formPageSurfaceClassName, 'space-y-4')}
                    >
                        {({ errors, processing }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input id="name" name="name" defaultValue={editingPermission?.name} />
                                    <InputError message={errors.name} />
                                </div>
                                <div className="flex gap-2">
                                    <Button disabled={processing}>{isEdit ? 'Update' : 'Create'}</Button>
                                    <Button variant="outline" asChild>
                                        <Link href="/settings/system/permissions">Back</Link>
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                )}
                {!isFormPage && (
                    <div className="overflow-x-auto rounded-lg border">
                        <table className="w-full min-w-[700px] text-left text-sm">
                            <thead className="bg-muted/30">
                                <tr>
                                    <th className="px-4 py-3">Permission</th>
                                    <th className="px-4 py-3">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {permissions.length === 0 ? (
                                    <tr>
                                        <td colSpan={2} className="px-4 py-8 text-center text-muted-foreground">
                                            No permissions found.
                                        </td>
                                    </tr>
                                ) : (
                                    permissions.map((permission) => (
                                        <tr key={permission.id} className="border-t">
                                            <td className="px-4 py-3 font-medium">{permission.name}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex gap-2">
                                                    <Button className="bg-sky-600 text-white hover:bg-sky-700" asChild>
                                                        <Link href={`/settings/system/permissions/${permission.id}`}>View</Link>
                                                    </Button>
                                                    {canUpdatePermission && (
                                                        <Button variant="outline" asChild>
                                                            <Link href={`/settings/system/permissions/${permission.id}/edit`}>Edit</Link>
                                                        </Button>
                                                    )}
                                                    {canDeletePermission && (
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            disabled={deletingPermissionId !== null}
                                                            onClick={() => openDeleteDialog(permission)}
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
            </div>
            <ConfirmDeleteDialog
                open={selectedDeletePermission !== null}
                title="Delete permission"
                description={
                    selectedDeletePermission
                        ? `Are you sure you want to delete ${selectedDeletePermission.name}? This action cannot be undone.`
                        : ''
                }
                errorMessage={deleteError ?? undefined}
                confirmLabel="Delete permission"
                processing={deletingPermissionId !== null}
                onOpenChange={(open) => {
                    if (!open && deletingPermissionId === null) {
                        setSelectedDeletePermission(null);
                        setDeleteError(null);
                    }
                }}
                onCancel={() => {
                    setSelectedDeletePermission(null);
                    setDeleteError(null);
                }}
                onConfirm={confirmDeletePermission}
            />
        </SystemLayout>
    );
}
