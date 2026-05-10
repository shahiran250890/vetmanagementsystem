import { Link } from '@inertiajs/react';

import { FormDropdown } from '@/components/form-dropdown';
import { FormInput } from '@/components/form-input';
import { ListPageFilterActions } from '@/components/list-page-filter-actions';
import { ListPageFilters } from '@/components/list-page-filters';
import { Button } from '@/components/ui/button';
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
                    <FormDropdown
                        id="filter-role"
                        name="filter_role"
                        label="Role"
                        options={roles.map((r) => ({
                            value: String(r.id),
                            label: r.name,
                        }))}
                        value={filters.role_id === null ? '' : String(filters.role_id)}
                        onValueChange={(v) =>
                            onFiltersChange({
                                role_id: v === '' ? null : Number.parseInt(v, 10),
                            })
                        }
                        allowEmpty
                        emptyOptionLabel="All roles"
                        placeholder="All roles"
                        className="gap-1.5"
                    />
                    <FormDropdown
                        id="filter-dept"
                        name="filter_department"
                        label="Department"
                        options={filterOptions.departments.map((d) => ({
                            value: d,
                            label: d,
                        }))}
                        value={filters.department}
                        onValueChange={(v) => onFiltersChange({ department: v })}
                        allowEmpty
                        emptyOptionLabel="All"
                        placeholder="All"
                        className="gap-1.5"
                    />
                    <FormDropdown
                        id="filter-estatus"
                        name="filter_employment_status"
                        label="Employment status"
                        options={[
                            { value: 'active', label: 'Active' },
                            { value: 'on_leave', label: 'On leave' },
                            { value: 'probation', label: 'Probation' },
                            { value: 'suspended', label: 'Suspended' },
                            { value: 'resigned', label: 'Resigned' },
                            { value: 'terminated', label: 'Terminated' },
                        ]}
                        value={filters.employment_status}
                        onValueChange={(v) => onFiltersChange({ employment_status: v })}
                        allowEmpty
                        emptyOptionLabel="All"
                        placeholder="All"
                        className="gap-1.5"
                    />
                    <FormDropdown
                        id="filter-clinic"
                        name="filter_clinic"
                        label="Clinic"
                        options={filterOptions.clinics.map((c) => ({
                            value: c,
                            label: c,
                        }))}
                        value={filters.clinic}
                        onValueChange={(v) => onFiltersChange({ clinic: v })}
                        allowEmpty
                        emptyOptionLabel="All"
                        placeholder="All"
                        className="gap-1.5"
                    />
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
