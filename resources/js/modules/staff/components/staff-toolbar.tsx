import { Link } from '@inertiajs/react';

import { FormInput } from '@/components/form-input';
import { ListPageFilterActions } from '@/components/list-page-filter-actions';
import { ListPageFilters } from '@/components/list-page-filters';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import usersRoutes from '@/routes/settings/system/users';

import type { StaffFilterOptions, StaffFilters } from '../types';

type Role = { id: number; name: string };

export function StaffToolbar({
    search,
    onSearchChange,
    filters,
    onFiltersChange,
    filterOptions,
    roles,
    onApply,
    onReset,
    canCreateUser,
    isFormPage,
    onExportCsv,
    onExportPdf,
    selectedCount,
    onBulkDeactivate,
    onBulkActivate,
    onBulkRoles,
}: {
    search: string;
    onSearchChange: (value: string) => void;
    filters: StaffFilters;
    onFiltersChange: (patch: Partial<StaffFilters>) => void;
    filterOptions: StaffFilterOptions;
    roles: Role[];
    onApply: () => void;
    onReset: () => void;
    canCreateUser: boolean;
    isFormPage: boolean;
    onExportCsv: () => void;
    onExportPdf: () => void;
    selectedCount: number;
    onBulkDeactivate: () => void;
    onBulkActivate: () => void;
    onBulkRoles: () => void;
}) {
    if (isFormPage) {
        return null;
    }

    return (
        <ListPageFilters>
            <div className="flex flex-col gap-4">
                <div className="grid w-full gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
                    <div className="grid min-w-0 gap-2">
                        <FormInput
                            label="Search"
                            id="staff-search"
                            value={search}
                            onChange={(event) => onSearchChange(event.target.value)}
                            placeholder="Name, staff ID, email…"
                        />
                    </div>
                    <div className="flex flex-wrap items-end gap-2">
                        <ListPageFilterActions onApply={onApply} onReset={onReset} />
                        {canCreateUser && (
                            <Button asChild className="shrink-0">
                                <Link href={usersRoutes.create.url()}>Add staff</Link>
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="grid gap-1.5">
                        <Label htmlFor="filter-role">Role</Label>
                        <select
                            id="filter-role"
                            className="border-input bg-background h-9 w-full rounded-md border px-2 text-sm"
                            value={filters.role_id ?? ''}
                            onChange={(e) =>
                                onFiltersChange({
                                    role_id: e.target.value === '' ? null : Number.parseInt(e.target.value, 10),
                                })
                            }
                        >
                            <option value="">All roles</option>
                            {roles.map((r) => (
                                <option key={r.id} value={r.id}>
                                    {r.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="grid gap-1.5">
                        <Label htmlFor="filter-dept">Department</Label>
                        <select
                            id="filter-dept"
                            className="border-input bg-background h-9 w-full rounded-md border px-2 text-sm"
                            value={filters.department}
                            onChange={(e) => onFiltersChange({ department: e.target.value })}
                        >
                            <option value="">All</option>
                            {filterOptions.departments.map((d) => (
                                <option key={d} value={d}>
                                    {d}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="grid gap-1.5">
                        <Label htmlFor="filter-estatus">Employment status</Label>
                        <select
                            id="filter-estatus"
                            className="border-input bg-background h-9 w-full rounded-md border px-2 text-sm"
                            value={filters.employment_status}
                            onChange={(e) => onFiltersChange({ employment_status: e.target.value })}
                        >
                            <option value="">All</option>
                            <option value="active">Active</option>
                            <option value="on_leave">On leave</option>
                            <option value="probation">Probation</option>
                            <option value="suspended">Suspended</option>
                            <option value="resigned">Resigned</option>
                            <option value="terminated">Terminated</option>
                        </select>
                    </div>
                    <div className="grid gap-1.5">
                        <Label htmlFor="filter-clinic">Clinic</Label>
                        <select
                            id="filter-clinic"
                            className="border-input bg-background h-9 w-full rounded-md border px-2 text-sm"
                            value={filters.clinic}
                            onChange={(e) => onFiltersChange({ clinic: e.target.value })}
                        >
                            <option value="">All</option>
                            {filterOptions.clinics.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={onExportCsv}>
                        Export CSV
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={onExportPdf}>
                        Print / PDF
                    </Button>
                    {selectedCount > 0 && (
                        <>
                            <span className="text-muted-foreground text-sm">{selectedCount} selected</span>
                            <Button type="button" variant="outline" size="sm" onClick={onBulkActivate}>
                                Enable accounts
                            </Button>
                            <Button type="button" variant="outline" size="sm" onClick={onBulkDeactivate}>
                                Disable accounts
                            </Button>
                            <Button type="button" variant="secondary" size="sm" onClick={onBulkRoles}>
                                Assign roles…
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </ListPageFilters>
    );
}
