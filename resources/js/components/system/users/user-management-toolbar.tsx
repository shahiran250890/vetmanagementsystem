import { Link } from '@inertiajs/react';

import { ListPageFilterActions } from '@/components/list-page-filter-actions';
import { ListPageFilters } from '@/components/list-page-filters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import usersRoutes from '@/routes/settings/system/users';

type UserManagementToolbarProps = {
    search: string;
    onSearchChange: (value: string) => void;
    onApply: () => void;
    onReset: () => void;
    canCreateUser: boolean;
    isFormPage: boolean;
};

export function UserManagementToolbar({
    search,
    onSearchChange,
    onApply,
    onReset,
    canCreateUser,
    isFormPage,
}: UserManagementToolbarProps) {
    if (isFormPage) {
        return null;
    }

    return (
        <ListPageFilters>
            <div className="grid w-full gap-4 md:grid-cols-[1fr_auto] md:items-end">
                <div className="grid min-w-0 gap-2">
                    <Label htmlFor="user-search">Search</Label>
                    <Input
                        id="user-search"
                        value={search}
                        onChange={(event) => onSearchChange(event.target.value)}
                        placeholder="Search name or email"
                    />
                </div>
                <div className="flex flex-wrap items-end gap-2">
                    <ListPageFilterActions onApply={onApply} onReset={onReset} />
                    {canCreateUser && (
                        <Button asChild className="shrink-0">
                            <Link href={usersRoutes.create.url()}>Add user</Link>
                        </Button>
                    )}
                </div>
            </div>
        </ListPageFilters>
    );
}
