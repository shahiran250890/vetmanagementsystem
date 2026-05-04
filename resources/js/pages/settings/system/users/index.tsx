import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import ConfirmDeleteDialog from '@/components/confirm-delete-dialog';
import { UserManagementForm } from '@/components/system/users/user-management-form';
import { UserManagementTable } from '@/components/system/users/user-management-table';
import { UserManagementToolbar } from '@/components/system/users/user-management-toolbar';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import SystemLayout from '@/layouts/settings/system-layout';
import { index as systemHome } from '@/routes/settings/system';
import usersRoutes from '@/routes/settings/system/users';
import type { BreadcrumbItem, PaginatedCollection } from '@/types';

type Role = { id: number; name: string };
type User = { id: number; name: string; email: string; phone: string | null; is_enabled: boolean; roles: Role[] };
type PaginatedUsers = PaginatedCollection<User>;

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'System Setting', href: systemHome() },
    { title: 'User Management', href: usersRoutes.index() },
];

export default function UsersIndex({
    users,
    roles = [],
    managedUser,
    formMode,
    filters,
    canCreateUser,
    canUpdateUser,
    canDeleteUser,
}: {
    users: PaginatedUsers;
    roles?: Role[];
    managedUser?: User;
    formMode?: 'create' | 'edit';
    filters?: { search?: string };
    canCreateUser: boolean;
    canUpdateUser: boolean;
    canDeleteUser: boolean;
}) {
    const isEdit = formMode === 'edit' && managedUser;
    const isFormPage = formMode === 'create' || formMode === 'edit';
    const formAction = isEdit ? usersRoutes.update.url(managedUser!.id) : usersRoutes.store.url();
    const formMethod = isEdit ? 'put' : 'post';
    const selectedRoleIds = new Set((managedUser?.roles ?? []).map((role) => role.id));
    const [search, setSearch] = useState(filters?.search ?? '');
    const [isEnabled, setIsEnabled] = useState(managedUser?.is_enabled ?? true);
    const [showPasswordFields, setShowPasswordFields] = useState(!isEdit);
    const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);
    const [selectedStatusUser, setSelectedStatusUser] = useState<User | null>(null);
    const [showStatusSuccessDialog, setShowStatusSuccessDialog] = useState(false);
    const [selectedDeleteUser, setSelectedDeleteUser] = useState<User | null>(null);
    const [deletingUserId, setDeletingUserId] = useState<number | null>(null);
    const formatRoleName = (roleName: string) => (roleName ? roleName.charAt(0).toUpperCase() + roleName.slice(1) : roleName);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- form defaults when switching edited user
        setIsEnabled(managedUser?.is_enabled ?? true);
    }, [managedUser?.id, managedUser?.is_enabled, formMode]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- reset password fields visibility when switching user
        setShowPasswordFields(!isEdit);
    }, [isEdit, managedUser?.id]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- sync applied server filters into local draft after Inertia navigation
        setSearch(filters?.search ?? '');
    }, [filters?.search]);

    const applyFilters = () => {
        router.get(
            usersRoutes.index.url({ query: { search, page: 1 } }),
            {},
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const resetFilters = () => {
        setSearch('');
        router.get(
            usersRoutes.index.url(),
            {},
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const goToPage = (page: number) => {
        router.get(
            usersRoutes.index.url({ query: { search: filters?.search ?? '', page } }),
            {},
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const openStatusDialog = (user: User) => {
        if (!canUpdateUser || updatingUserId !== null) {
            return;
        }

        setSelectedStatusUser(user);
    };

    const toggleUserStatus = () => {
        if (!selectedStatusUser) {
            return;
        }

        if (!canUpdateUser || updatingUserId !== null) {
            return;
        }

        setUpdatingUserId(selectedStatusUser.id);

        router.patch(
            usersRoutes.toggleStatus.url(selectedStatusUser.id),
            { is_enabled: !selectedStatusUser.is_enabled },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    setSelectedStatusUser(null);
                    setShowStatusSuccessDialog(true);
                },
                onFinish: () => {
                    setUpdatingUserId(null);
                },
            },
        );
    };

    const openDeleteDialog = (user: User) => {
        if (!canDeleteUser || deletingUserId !== null) {
            return;
        }

        setSelectedDeleteUser(user);
    };

    const confirmDeleteUser = () => {
        if (!selectedDeleteUser || !canDeleteUser || deletingUserId !== null) {
            return;
        }

        setDeletingUserId(selectedDeleteUser.id);

        router.delete(usersRoutes.destroy.url(selectedDeleteUser.id), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setSelectedDeleteUser(null);
            },
            onFinish: () => {
                setDeletingUserId(null);
            },
        });
    };

    return (
        <SystemLayout pageTitle="System Setting - User Management" breadcrumbs={breadcrumbs}>
            <div className="space-y-4">
                <UserManagementToolbar
                    search={search}
                    onSearchChange={setSearch}
                    onApply={applyFilters}
                    onReset={resetFilters}
                    canCreateUser={canCreateUser}
                    isFormPage={isFormPage}
                />
                {isFormPage && (canCreateUser || canUpdateUser) && (
                    <UserManagementForm
                        isEdit={Boolean(isEdit)}
                        managedUser={managedUser}
                        roles={roles}
                        formAction={formAction}
                        formMethod={formMethod}
                        selectedRoleIds={selectedRoleIds}
                        isEnabled={isEnabled}
                        onIsEnabledChange={setIsEnabled}
                        showPasswordFields={showPasswordFields}
                        onTogglePasswordFields={() => setShowPasswordFields((value) => !value)}
                        formatRoleName={formatRoleName}
                    />
                )}
                {!isFormPage && (
                    <UserManagementTable
                        users={users}
                        canUpdateUser={canUpdateUser}
                        canDeleteUser={canDeleteUser}
                        updatingUserId={updatingUserId}
                        deletingUserId={deletingUserId}
                        onOpenStatusDialog={openStatusDialog}
                        onOpenDeleteDialog={openDeleteDialog}
                        onPageChange={goToPage}
                    />
                )}
            </div>
            <Dialog open={selectedStatusUser !== null} onOpenChange={(open) => !open && updatingUserId === null && setSelectedStatusUser(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update user status</DialogTitle>
                        <DialogDescription>
                            {selectedStatusUser
                                ? `Change ${selectedStatusUser.name} status to ${selectedStatusUser.is_enabled ? 'Disabled' : 'Enabled'}?`
                                : ''}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button type="button" variant="outline" disabled={updatingUserId !== null} onClick={() => setSelectedStatusUser(null)}>
                            Cancel
                        </Button>
                        <Button type="button" disabled={updatingUserId !== null} onClick={toggleUserStatus}>
                            {updatingUserId !== null ? (
                                <span className="inline-flex items-center gap-2">
                                    <Spinner className="size-4" />
                                    Processing...
                                </span>
                            ) : (
                                'Confirm'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <Dialog open={showStatusSuccessDialog} onOpenChange={setShowStatusSuccessDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Success</DialogTitle>
                        <DialogDescription>User status has been updated successfully.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button type="button" onClick={() => setShowStatusSuccessDialog(false)}>
                            OK
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <ConfirmDeleteDialog
                open={selectedDeleteUser !== null}
                title="Delete user"
                description={
                    selectedDeleteUser ? `Are you sure you want to delete ${selectedDeleteUser.name}? This action cannot be undone.` : ''
                }
                confirmLabel="Delete user"
                processing={deletingUserId !== null}
                onOpenChange={(open) => !open && deletingUserId === null && setSelectedDeleteUser(null)}
                onCancel={() => setSelectedDeleteUser(null)}
                onConfirm={confirmDeleteUser}
            />
        </SystemLayout>
    );
}
