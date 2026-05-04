import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import ListPagination from '@/components/system/list-pagination';
import usersRoutes from '@/routes/settings/system/users';
import type { PaginatedCollection } from '@/types';

type Role = { id: number; name: string };

type User = {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    is_enabled: boolean;
    roles: Role[];
};

type PaginatedUsers = PaginatedCollection<User>;

type UserManagementTableProps = {
    users: PaginatedUsers;
    canUpdateUser: boolean;
    canDeleteUser: boolean;
    updatingUserId: number | null;
    deletingUserId: number | null;
    onOpenStatusDialog: (user: User) => void;
    onOpenDeleteDialog: (user: User) => void;
    onPageChange: (page: number) => void;
};

export function UserManagementTable({
    users,
    canUpdateUser,
    canDeleteUser,
    updatingUserId,
    deletingUserId,
    onOpenStatusDialog,
    onOpenDeleteDialog,
    onPageChange,
}: UserManagementTableProps) {
    return (
        <>
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
                                            onClick={() => onOpenStatusDialog(user)}
                                            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium transition ${user.is_enabled ? 'bg-green-500/15 text-green-600' : 'bg-muted text-muted-foreground'} ${canUpdateUser ? 'cursor-pointer hover:opacity-80' : 'cursor-not-allowed opacity-60'} ${updatingUserId !== null ? 'pointer-events-none opacity-60' : ''}`}
                                        >
                                            {user.is_enabled ? 'Enabled' : 'Disabled'}
                                        </button>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <Button className="bg-sky-600 text-white hover:bg-sky-700" asChild>
                                                <Link href={usersRoutes.show.url(user.id)}>View</Link>
                                            </Button>
                                            {canUpdateUser && (
                                                <Button variant="outline" asChild>
                                                    <Link href={usersRoutes.edit.url(user.id)}>Edit</Link>
                                                </Button>
                                            )}
                                            {canDeleteUser && (
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    disabled={deletingUserId !== null}
                                                    onClick={() => onOpenDeleteDialog(user)}
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
            <ListPagination
                currentPage={users.current_page}
                lastPage={users.last_page}
                from={users.from}
                to={users.to}
                total={users.total}
                onPageChange={onPageChange}
            />
        </>
    );
}
