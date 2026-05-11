import { Link } from '@inertiajs/react';
import { ArrowDown, ArrowUp } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import ListPagination from '@/components/system/list-pagination';
import usersRoutes from '@/routes/settings/system/users';
import type { PaginatedCollection } from '@/types';
import { cn } from '@/lib/utils';

import { AccountStatusBadge } from './account-status-badge';
import { StaffStatusBadge } from './staff-status-badge';

import type { StaffFilters, StaffMember } from '../types';

type PaginatedStaff = PaginatedCollection<StaffMember>;

function initials(name: string): string {
    const parts = name.trim().split(/\s+/).filter(Boolean);

    if (parts.length === 0) {
        return '?';
    }

    if (parts.length === 1) {
        return parts[0].slice(0, 2).toUpperCase();
    }

    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function SortButton({
    label,
    column,
    activeColumn,
    direction,
    onSort,
}: {
    label: string;
    column: string;
    activeColumn: string;
    direction: string;
    onSort: (column: string) => void;
}) {
    const active = activeColumn === column;

    return (
        <button
            type="button"
            className="inline-flex items-center gap-1 font-medium hover:underline"
            onClick={() => onSort(column)}
        >
            {label}
            {active ? direction === 'desc' ? <ArrowDown className="size-3.5" /> : <ArrowUp className="size-3.5" /> : null}
        </button>
    );
}

export function StaffDirectoryTable({
    staff,
    filters,
    onSort,
    canUpdateUser,
    canDeleteUser,
    updatingStaffId,
    deletingStaffId,
    onOpenStatusDialog,
    onOpenDeleteDialog,
    onPageChange,
    selectedIds,
    onToggleOne,
    onToggleAll,
}: {
    staff: PaginatedStaff;
    filters: StaffFilters;
    onSort: (column: string) => void;
    canUpdateUser: boolean;
    canDeleteUser: boolean;
    updatingStaffId: number | null;
    deletingStaffId: number | null;
    onOpenStatusDialog: (member: StaffMember) => void;
    onOpenDeleteDialog: (member: StaffMember) => void;
    onPageChange: (page: number) => void;
    selectedIds: Set<number>;
    onToggleOne: (id: number, checked: boolean) => void;
    onToggleAll: (checked: boolean) => void;
}) {
    const allIds = staff.data.map((row) => row.id);
    const allSelected = allIds.length > 0 && allIds.every((id) => selectedIds.has(id));

    return (
        <>
            <div className="border-border bg-card overflow-hidden rounded-2xl border shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1000px] text-left text-sm">
                        <thead className="bg-muted/40 border-b">
                            <tr>
                                <th className="w-10 px-3 py-3">
                                    <Checkbox
                                        checked={allSelected}
                                        onCheckedChange={(v) => onToggleAll(v === true)}
                                        aria-label="Select all on this page"
                                    />
                                </th>
                                <th className="px-3 py-3">Photo</th>
                                <th className="px-3 py-3">
                                    <SortButton
                                        label="Staff number"
                                        column="staff_number"
                                        activeColumn={filters.sort}
                                        direction={filters.direction}
                                        onSort={onSort}
                                    />
                                </th>
                                <th className="px-3 py-3">
                                    <SortButton
                                        label="Full name"
                                        column="full_name"
                                        activeColumn={filters.sort}
                                        direction={filters.direction}
                                        onSort={onSort}
                                    />
                                </th>
                                <th className="px-3 py-3">
                                    <SortButton
                                        label="Position"
                                        column="position"
                                        activeColumn={filters.sort}
                                        direction={filters.direction}
                                        onSort={onSort}
                                    />
                                </th>
                                <th className="px-3 py-3">
                                    <SortButton
                                        label="Department"
                                        column="department"
                                        activeColumn={filters.sort}
                                        direction={filters.direction}
                                        onSort={onSort}
                                    />
                                </th>
                                <th className="px-3 py-3">Mobile</th>
                                <th className="px-3 py-3">Email</th>
                                <th className="px-3 py-3">Clinic(s)</th>
                                <th className="px-3 py-3">Login</th>
                                <th className="px-3 py-3">
                                    <SortButton
                                        label="Employment"
                                        column="employment_status"
                                        activeColumn={filters.sort}
                                        direction={filters.direction}
                                        onSort={onSort}
                                    />
                                </th>
                                <th className="px-3 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {staff.data.length === 0 ? (
                                <tr>
                                    <td colSpan={12} className="text-muted-foreground px-4 py-10 text-center">
                                        No staff found.
                                    </td>
                                </tr>
                            ) : (
                                staff.data.map((row) => (
                                    <tr key={row.id} className="border-border/80 border-t">
                                        <td className="px-3 py-2 align-middle">
                                            <Checkbox
                                                checked={selectedIds.has(row.id)}
                                                onCheckedChange={(v) => onToggleOne(row.id, v === true)}
                                                aria-label={`Select ${row.full_name}`}
                                            />
                                        </td>
                                        <td className="px-3 py-2 align-middle">
                                            <div className="bg-muted flex size-9 items-center justify-center rounded-full text-xs font-semibold">
                                                {row.photo_path ? (
                                                    <img src={row.photo_path} alt="" className="size-9 rounded-full object-cover" />
                                                ) : (
                                                    initials(row.full_name)
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-3 py-2 align-middle font-mono text-xs">{row.staff_number}</td>
                                        <td className="px-3 py-2 align-middle font-medium">{row.full_name}</td>
                                        <td className="px-3 py-2 align-middle">{row.position ?? '—'}</td>
                                        <td className="px-3 py-2 align-middle">{row.department ?? '—'}</td>
                                        <td className="px-3 py-2 align-middle">{row.mobile_number ?? '—'}</td>
                                        <td className="text-muted-foreground max-w-[180px] truncate px-3 py-2 align-middle">
                                            {row.email ?? '—'}
                                        </td>
                                        <td className="text-muted-foreground max-w-[160px] truncate px-3 py-2 align-middle text-xs">
                                            {(row.assigned_clinics ?? []).join(', ') || '—'}
                                        </td>
                                        <td className="px-3 py-2 align-middle">
                                            {row.enable_login && canUpdateUser ? (
                                                <button
                                                    type="button"
                                                    disabled={updatingStaffId !== null}
                                                    onClick={() => onOpenStatusDialog(row)}
                                                    className={cn(
                                                        'inline-flex rounded-md p-0.5 transition focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2',
                                                        updatingStaffId !== null
                                                            ? 'cursor-not-allowed opacity-60'
                                                            : 'cursor-pointer hover:bg-muted/80',
                                                    )}
                                                    aria-label={`Change sign-in access for ${row.full_name}`}
                                                >
                                                    <AccountStatusBadge
                                                        enableLogin={row.enable_login}
                                                        isEnabled={row.is_enabled}
                                                    />
                                                </button>
                                            ) : (
                                                <AccountStatusBadge
                                                    enableLogin={row.enable_login}
                                                    isEnabled={row.is_enabled}
                                                />
                                            )}
                                        </td>
                                        <td className="px-3 py-2 align-middle">
                                            <StaffStatusBadge employmentStatus={row.employment_status} />
                                        </td>
                                        <td className="px-3 py-2 align-middle">
                                            <div className="flex flex-wrap items-center gap-1">
                                                <Button
                                                    className="h-7 min-w-20 shrink-0 px-2 text-xs bg-sky-600 text-white hover:bg-sky-700"
                                                    asChild
                                                >
                                                    <Link href={usersRoutes.show.url(row.id)}>View</Link>
                                                </Button>
                                                {canUpdateUser && (
                                                    <Button
                                                        variant="outline"
                                                        className="h-7 min-w-20 shrink-0 px-2 text-xs"
                                                        asChild
                                                    >
                                                        <Link href={usersRoutes.edit.url(row.id)}>Edit</Link>
                                                    </Button>
                                                )}
                                                {canDeleteUser && (
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        className="h-7 min-w-20 shrink-0 px-2 text-xs"
                                                        disabled={deletingStaffId !== null}
                                                        onClick={() => onOpenDeleteDialog(row)}
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
            </div>
            <ListPagination
                currentPage={staff.current_page}
                lastPage={staff.last_page}
                from={staff.from}
                to={staff.to}
                total={staff.total}
                onPageChange={onPageChange}
            />
        </>
    );
}
