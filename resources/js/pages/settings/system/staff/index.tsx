import { router } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';

import type { NationalityOption } from '@/components/address-fields';
import ConfirmDeleteDialog from '@/components/confirm-delete-dialog';
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
import { StaffDirectoryTable } from '@/modules/staff/components/staff-directory-table';
import { StaffForm } from '@/modules/staff/components/staff-form';
import { StaffToolbar } from '@/modules/staff/components/staff-toolbar';
import { navigateStaffIndex } from '@/modules/staff/hooks/use-staff';
import type { StaffFilterOptions, StaffFilters, StaffMember } from '@/modules/staff/types';
import { index as systemHome } from '@/routes/settings/system';
import usersRoutes, { bulkRoles, bulkStatus } from '@/routes/settings/system/users';
import type { BreadcrumbItem, PaginatedCollection } from '@/types';


type Role = { id: number; name: string };

type PaginatedStaff = PaginatedCollection<StaffMember>;

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'System Setting', href: systemHome() },
    { title: 'Staff Management', href: usersRoutes.index() },
];

export default function StaffIndex({
    staff,
    roles = [],
    reportingManagers = [],
    managedStaff,
    formMode,
    filters,
    filterOptions,
    nationalities = [],
    canCreateUser,
    canUpdateUser,
    canDeleteUser,
}: {
    staff: PaginatedStaff;
    roles?: Role[];
    reportingManagers?: Array<{ id: number; full_name: string; staff_number: string }>;
    managedStaff?: StaffMember;
    formMode?: 'create' | 'edit';
    filters?: StaffFilters;
    filterOptions?: StaffFilterOptions;
    nationalities?: NationalityOption[];
    canCreateUser: boolean;
    canUpdateUser: boolean;
    canDeleteUser: boolean;
}) {
    const mergedFilters: StaffFilters = useMemo(
        () => ({
            search: filters?.search ?? '',
            sort: filters?.sort ?? '',
            direction: filters?.direction ?? 'asc',
            role_id: filters?.role_id ?? null,
            department: filters?.department ?? '',
            employment_status: filters?.employment_status ?? '',
            clinic: filters?.clinic ?? '',
            per_page: filters?.per_page ?? 10,
        }),
        [filters],
    );

    const isEdit = formMode === 'edit' && managedStaff;
    const isFormPage = formMode === 'create' || formMode === 'edit';
    const formAction = isEdit ? usersRoutes.update.url(managedStaff!.id) : usersRoutes.store.url();
    const formMethod = isEdit ? 'put' : 'post';

    const formatRoleName = (roleName: string) =>
        roleName ? roleName.charAt(0).toUpperCase() + roleName.slice(1) : roleName;

    const [search, setSearch] = useState(mergedFilters.search);
    const [draftFilters, setDraftFilters] = useState<StaffFilters>(mergedFilters);
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const [updatingStaffId, setUpdatingStaffId] = useState<number | null>(null);
    const [selectedStatusMember, setSelectedStatusMember] = useState<StaffMember | null>(null);
    const [showStatusSuccessDialog, setShowStatusSuccessDialog] = useState(false);
    const [selectedDeleteMember, setSelectedDeleteMember] = useState<StaffMember | null>(null);
    const [deletingStaffId, setDeletingStaffId] = useState<number | null>(null);
    const [bulkRolesOpen, setBulkRolesOpen] = useState(false);
    const [bulkRoleIds, setBulkRoleIds] = useState<Set<number>>(new Set());

    useEffect(() => {
        setSearch(mergedFilters.search);
        setDraftFilters(mergedFilters);
    }, [mergedFilters]);

    useEffect(() => {
        setSelectedIds(new Set());
    }, [staff.current_page, mergedFilters.search, mergedFilters.sort]);

    const applyFilters = () => {
        navigateStaffIndex({ ...draftFilters, search }, 1);
    };

    const resetFilters = () => {
        const cleared: StaffFilters = {
            search: '',
            sort: '',
            direction: 'asc',
            role_id: null,
            department: '',
            employment_status: '',
            clinic: '',
            per_page: 10,
        };
        setSearch('');
        setDraftFilters(cleared);
        navigateStaffIndex(cleared, 1);
    };

    const goToPage = (page: number) => {
        navigateStaffIndex({ ...mergedFilters, search: mergedFilters.search }, page);
    };

    const onSort = (column: string) => {
        const nextDirection =
            mergedFilters.sort === column && mergedFilters.direction === 'asc' ? 'desc' : 'asc';
        navigateStaffIndex({ ...mergedFilters, sort: column, direction: nextDirection }, 1);
    };

    const exportQuery = () =>
        new URLSearchParams({
            ...(mergedFilters.search ? { search: mergedFilters.search } : {}),
            ...(mergedFilters.sort ? { sort: mergedFilters.sort } : {}),
            ...(mergedFilters.direction ? { direction: mergedFilters.direction } : {}),
            ...(mergedFilters.role_id ? { role_id: String(mergedFilters.role_id) } : {}),
            ...(mergedFilters.department ? { department: mergedFilters.department } : {}),
            ...(mergedFilters.employment_status ? { employment_status: mergedFilters.employment_status } : {}),
            ...(mergedFilters.clinic ? { clinic: mergedFilters.clinic } : {}),
        }).toString();

    const onExportCsv = () => {
        const qs = exportQuery();
        window.location.href = qs ? `${usersRoutes.export.csv.url()}?${qs}` : usersRoutes.export.csv.url();
    };

    const onExportPdf = () => {
        const qs = exportQuery();
        window.open(qs ? `${usersRoutes.export.pdf.url()}?${qs}` : usersRoutes.export.pdf.url(), '_blank', 'noopener,noreferrer');
    };

    const toggleSelection = (id: number, checked: boolean) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);

            if (checked) {
                next.add(id);
            } else {
                next.delete(id);
            }

            return next;
        });
    };

    const toggleSelectAll = (checked: boolean) => {
        if (!checked) {
            setSelectedIds(new Set());

            return;
        }

        setSelectedIds(new Set(staff.data.map((row) => row.id)));
    };

    const confirmBulkStatus = (isEnabled: boolean) => {
        router.post(
            bulkStatus.url(),
            {
                staff_ids: [...selectedIds],
                is_enabled: isEnabled,
            },
            {
                preserveScroll: true,
                onSuccess: () => setSelectedIds(new Set()),
            },
        );
    };

    const confirmBulkRoles = () => {
        router.post(
            bulkRoles.url(),
            {
                staff_ids: [...selectedIds],
                role_ids: [...bulkRoleIds],
                replace_existing: true,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setBulkRolesOpen(false);
                    setBulkRoleIds(new Set());
                    setSelectedIds(new Set());
                },
            },
        );
    };

    const openStatusDialog = (member: StaffMember) => {
        if (!member.enable_login || !canUpdateUser || updatingStaffId !== null) {
            return;
        }

        setSelectedStatusMember(member);
    };

    const toggleAccountEnabled = () => {
        if (!selectedStatusMember || !selectedStatusMember.enable_login || !canUpdateUser || updatingStaffId !== null) {
            return;
        }

        setUpdatingStaffId(selectedStatusMember.id);

        router.patch(
            usersRoutes.toggleStatus.url(selectedStatusMember.id),
            { is_enabled: !selectedStatusMember.is_enabled },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    setSelectedStatusMember(null);
                    setShowStatusSuccessDialog(true);
                },
                onFinish: () => {
                    setUpdatingStaffId(null);
                },
            },
        );
    };

    const openDeleteDialog = (member: StaffMember) => {
        if (!canDeleteUser || deletingStaffId !== null) {
            return;
        }

        setSelectedDeleteMember(member);
    };

    const confirmDeleteStaff = () => {
        if (!selectedDeleteMember || !canDeleteUser || deletingStaffId !== null) {
            return;
        }

        setDeletingStaffId(selectedDeleteMember.id);

        router.delete(usersRoutes.destroy.url(selectedDeleteMember.id), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setSelectedDeleteMember(null);
            },
            onFinish: () => {
                setDeletingStaffId(null);
            },
        });
    };

    const fo: StaffFilterOptions = filterOptions ?? { departments: [], clinics: [] };

    return (
        <SystemLayout pageTitle="System Setting - Staff Management" breadcrumbs={breadcrumbs}>
            <div className="space-y-4">
                <StaffToolbar
                    search={search}
                    onSearchChange={setSearch}
                    filters={draftFilters}
                    onFiltersChange={(patch) => setDraftFilters((prev) => ({ ...prev, ...patch }))}
                    filterOptions={fo}
                    roles={roles}
                    onApply={applyFilters}
                    onReset={resetFilters}
                    canCreateUser={canCreateUser}
                    isFormPage={isFormPage}
                    onExportCsv={onExportCsv}
                    onExportPdf={onExportPdf}
                    selectedCount={selectedIds.size}
                    onBulkDeactivate={() => confirmBulkStatus(false)}
                    onBulkActivate={() => confirmBulkStatus(true)}
                    onBulkRoles={() => setBulkRolesOpen(true)}
                />
                {isFormPage && (canCreateUser || canUpdateUser) && (
                    <StaffForm
                        isEdit={Boolean(isEdit)}
                        managedStaff={managedStaff}
                        roles={roles}
                        reportingManagers={reportingManagers}
                        nationalities={nationalities}
                        formAction={formAction}
                        formMethod={formMethod}
                        formatRoleName={formatRoleName}
                    />
                )}
                {!isFormPage && (
                    <StaffDirectoryTable
                        staff={staff}
                        filters={mergedFilters}
                        onSort={onSort}
                        canUpdateUser={canUpdateUser}
                        canDeleteUser={canDeleteUser}
                        updatingStaffId={updatingStaffId}
                        deletingStaffId={deletingStaffId}
                        onOpenStatusDialog={openStatusDialog}
                        onOpenDeleteDialog={openDeleteDialog}
                        onPageChange={goToPage}
                        selectedIds={selectedIds}
                        onToggleOne={toggleSelection}
                        onToggleAll={toggleSelectAll}
                    />
                )}
            </div>

            <Dialog open={selectedStatusMember !== null} onOpenChange={(open) => !open && updatingStaffId === null && setSelectedStatusMember(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Update account access</DialogTitle>
                        <DialogDescription>
                            {selectedStatusMember
                                ? `Set login for ${selectedStatusMember.full_name} to ${selectedStatusMember.is_enabled ? 'disabled' : 'enabled'}?`
                                : ''}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button type="button" variant="outline" disabled={updatingStaffId !== null} onClick={() => setSelectedStatusMember(null)}>
                            Cancel
                        </Button>
                        <Button type="button" disabled={updatingStaffId !== null} onClick={toggleAccountEnabled}>
                            {updatingStaffId !== null ? (
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
                        <DialogDescription>Account access has been updated successfully.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button type="button" onClick={() => setShowStatusSuccessDialog(false)}>
                            OK
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <ConfirmDeleteDialog
                open={selectedDeleteMember !== null}
                title="Delete staff record"
                description={
                    selectedDeleteMember
                        ? `Are you sure you want to delete ${selectedDeleteMember.full_name}? Linked login accounts will be removed. This action cannot be undone.`
                        : ''
                }
                confirmLabel="Delete staff"
                processing={deletingStaffId !== null}
                onOpenChange={(open) => !open && deletingStaffId === null && setSelectedDeleteMember(null)}
                onCancel={() => setSelectedDeleteMember(null)}
                onConfirm={confirmDeleteStaff}
            />

            <Dialog open={bulkRolesOpen} onOpenChange={setBulkRolesOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Assign roles</DialogTitle>
                        <DialogDescription>
                            Applies selected roles to accounts that have a login. Records without login are skipped.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid max-h-60 gap-2 overflow-y-auto py-2">
                        {roles.map((role) => (
                            <label key={role.id} className="flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={bulkRoleIds.has(role.id)}
                                    onChange={(e) =>
                                        setBulkRoleIds((prev) => {
                                            const next = new Set(prev);

                                            if (e.target.checked) {
                                                next.add(role.id);
                                            } else {
                                                next.delete(role.id);
                                            }

                                            return next;
                                        })
                                    }
                                />
                                {formatRoleName(role.name)}
                            </label>
                        ))}
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setBulkRolesOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="button" onClick={confirmBulkRoles}>
                            Apply roles
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </SystemLayout>
    );
}
