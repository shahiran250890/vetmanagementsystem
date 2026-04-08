import { Form, Head, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import FormStatusToggle from '@/components/form-status-toggle';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import type { BreadcrumbItem } from '@/types';

type Role = { id: number; name: string };
type User = { id: number; name: string; email: string; phone: string | null; is_enabled: boolean; roles: Role[] };
type PaginatedUsers = {
    data: User[];
    current_page: number;
    last_page: number;
    total: number;
    from: number | null;
    to: number | null;
};
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'System Setting', href: '/settings/system' },
    { title: 'User Management', href: '/settings/system/users' },
];

export default function UsersIndex({ users, roles = [], managedUser, formMode, filters, canCreateUser, canUpdateUser, canDeleteUser }: { users: PaginatedUsers; roles?: Role[]; managedUser?: User; formMode?: 'create'|'edit'; filters?: { search?: string }; canCreateUser: boolean; canUpdateUser: boolean; canDeleteUser: boolean }) {
    const isEdit = formMode === 'edit' && managedUser;
    const isFormPage = formMode === 'create' || formMode === 'edit';
    const action = isEdit ? `/settings/system/users/${managedUser.id}` : '/settings/system/users';
    const selectedRoleIds = new Set((managedUser?.roles ?? []).map((role) => role.id));
    const [search, setSearch] = useState(filters?.search ?? '');
    const [debouncedSearch, setDebouncedSearch] = useState(filters?.search ?? '');
    const [isEnabled, setIsEnabled] = useState(managedUser?.is_enabled ?? true);
    const [showPasswordFields, setShowPasswordFields] = useState(!isEdit);
    const [updatingUserId, setUpdatingUserId] = useState<number | null>(null);
    const [selectedStatusUser, setSelectedStatusUser] = useState<User | null>(null);
    const [showStatusSuccessDialog, setShowStatusSuccessDialog] = useState(false);

    useEffect(() => {
        setIsEnabled(managedUser?.is_enabled ?? true);
    }, [managedUser?.id, managedUser?.is_enabled, formMode]);

    useEffect(() => {
        setShowPasswordFields(!isEdit);
    }, [isEdit, managedUser?.id]);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedSearch(search);
        }, 300);

        return () => clearTimeout(timeout);
    }, [search]);

    useEffect(() => {
        if (debouncedSearch === (filters?.search ?? '')) {
            return;
        }

        router.get('/settings/system/users', { search: debouncedSearch, page: 1 }, { preserveState: true, preserveScroll: true, replace: true });
    }, [debouncedSearch, filters?.search]);

    const goToPage = (page: number) => {
        router.get('/settings/system/users', { search: filters?.search ?? '', page }, { preserveState: true, preserveScroll: true, replace: true });
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
            `/settings/system/users/${selectedStatusUser.id}/status`,
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="System Setting - User Management" />
            <SettingsLayout contentClassName="max-w-none">
                <div className="space-y-4">
                    {canCreateUser && ! isFormPage && (
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex flex-1 items-center gap-2">
                                <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name or email" />
                            </div>
                            <Button asChild>
                                <Link href="/settings/system/users/create">Add user</Link>
                            </Button>
                        </div>
                    )}
                    {isFormPage && (canCreateUser || canUpdateUser) && (
                        <Form action={action} method={isEdit ? 'put' : 'post'} className="space-y-4 rounded border p-4">
                            {({ errors, processing }) => (
                                <>
                                    <div className="grid gap-2"><Label htmlFor="name">Name</Label><Input id="name" name="name" defaultValue={managedUser?.name} /><InputError message={errors.name} /></div>
                                    <div className="grid gap-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" name="email" defaultValue={managedUser?.email} /><InputError message={errors.email} /></div>
                                    <div className="grid gap-2"><Label htmlFor="phone">Phone</Label><Input id="phone" name="phone" defaultValue={managedUser?.phone ?? ''} /><InputError message={errors.phone} /></div>
                                    {isEdit && (
                                        <div>
                                            <Button type="button" variant="outline" onClick={() => setShowPasswordFields((value) => ! value)}>
                                                {showPasswordFields ? 'Cancel password change' : 'Change password'}
                                            </Button>
                                        </div>
                                    )}
                                    {showPasswordFields && (
                                        <>
                                            <div className="grid gap-2"><Label htmlFor="password">Password</Label><Input id="password" type="password" name="password" /><InputError message={errors.password} /></div>
                                            <div className="grid gap-2"><Label htmlFor="password_confirmation">Confirm password</Label><Input id="password_confirmation" type="password" name="password_confirmation" /></div>
                                        </>
                                    )}
                                    <div className="grid gap-2"><Label>Roles</Label><div className="grid grid-cols-2 gap-2">{roles.map((role) => <label key={role.id} className="flex items-center gap-2 text-sm"><input type="checkbox" name="role_ids[]" value={role.id} defaultChecked={selectedRoleIds.has(role.id)} />{role.name}</label>)}</div></div>
                                    <FormStatusToggle
                                        id="is_enabled_toggle"
                                        name="is_enabled"
                                        label="Status"
                                        enabledText="Enabled"
                                        disabledText="Disabled"
                                        checked={isEnabled}
                                        onChange={setIsEnabled}
                                    />
                                    <div className="flex gap-2">
                                        <Button disabled={processing}>{isEdit ? 'Update' : 'Create'}</Button>
                                        <Button variant="outline" asChild>
                                            <Link href="/settings/system/users">Back</Link>
                                        </Button>
                                    </div>
                                </>
                            )}
                        </Form>
                    )}
                    {! isFormPage && (
                        <div className="overflow-x-auto rounded-lg border">
                            <table className="w-full min-w-[900px] text-left text-sm">
                                <thead className="bg-muted/30">
                                    <tr>
                                        <th className="px-4 py-3">User</th>
                                        <th className="px-4 py-3">Roles</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.data.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                                                No users found.
                                            </td>
                                        </tr>
                                    ) : (
                                        users.data.map((user) => (
                                            <tr key={user.id} className="border-t">
                                                <td className="px-4 py-3">
                                                    <p className="font-medium">{user.name}</p>
                                                    <p className="text-sm text-muted-foreground">{user.email}</p>
                                                </td>
                                                <td className="px-4 py-3 text-muted-foreground">{user.roles.map((role) => role.name).join(', ') || 'No roles'}</td>
                                                <td className="px-4 py-3">
                                                    <button
                                                        type="button"
                                                        disabled={!canUpdateUser || updatingUserId !== null}
                                                        onClick={() => openStatusDialog(user)}
                                                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium transition ${user.is_enabled ? 'bg-green-500/15 text-green-600' : 'bg-muted text-muted-foreground'} ${canUpdateUser ? 'cursor-pointer hover:opacity-80' : 'cursor-not-allowed opacity-60'} ${updatingUserId !== null ? 'pointer-events-none opacity-60' : ''}`}
                                                    >
                                                        {user.is_enabled ? 'Enabled' : 'Disabled'}
                                                    </button>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex gap-2">
                                                        {canUpdateUser && <Button variant="outline" asChild><Link href={`/settings/system/users/${user.id}/edit`}>Edit</Link></Button>}
                                                        {canDeleteUser && <Button variant="destructive" onClick={() => router.delete(`/settings/system/users/${user.id}`)}>Delete</Button>}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {! isFormPage && users.last_page > 1 && (
                        <div className="flex items-center justify-between rounded border px-4 py-3 text-sm">
                            <p className="text-muted-foreground">
                                Showing {users.from ?? 0} to {users.to ?? 0} of {users.total}
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={users.current_page <= 1}
                                    onClick={() => goToPage(users.current_page - 1)}
                                >
                                    Previous
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={users.current_page >= users.last_page}
                                    onClick={() => goToPage(users.current_page + 1)}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
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
                            <Button
                                type="button"
                                variant="outline"
                                disabled={updatingUserId !== null}
                                onClick={() => setSelectedStatusUser(null)}
                            >
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
            </SettingsLayout>
        </AppLayout>
    );
}
