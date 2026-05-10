import { FormDropdown } from '@/components/form-dropdown';
import { FormInput } from '@/components/form-input';
import FormStatusToggle from '@/components/form-status-toggle';

import type { StaffMember } from '../types';

const EMPLOYMENT_STATUSES = [
    { value: 'active', label: 'Active' },
    { value: 'on_leave', label: 'On leave' },
    { value: 'probation', label: 'Probation' },
    { value: 'suspended', label: 'Suspended' },
    { value: 'resigned', label: 'Resigned' },
    { value: 'terminated', label: 'Terminated' },
] as const;

export type ReportingManagerOption = { id: number; full_name: string; staff_number: string };

export function EmploymentSection({
    managedStaff,
    reportingManagers,
    errors,
    isActive,
    onIsActiveChange,
}: {
    managedStaff?: StaffMember;
    reportingManagers: ReportingManagerOption[];
    errors: Record<string, string>;
    isActive: boolean;
    onIsActiveChange: (value: boolean) => void;
}) {
    return (
        <div className="grid gap-4 sm:grid-cols-2">
            <FormInput
                label="Employee number"
                name="employee_number"
                defaultValue={managedStaff?.employee_number ?? ''}
                error={errors.employee_number}
            />
            <FormInput
                label="Hire date"
                name="hire_date"
                type="date"
                defaultValue={managedStaff?.hire_date ?? ''}
                error={errors.hire_date}
            />
            <FormInput
                label="Confirmation date"
                name="confirmation_date"
                type="date"
                defaultValue={managedStaff?.confirmation_date ?? ''}
                error={errors.confirmation_date}
            />
            <FormInput label="Position" name="position" defaultValue={managedStaff?.position ?? ''} error={errors.position} />
            <FormInput
                label="Department"
                name="department"
                defaultValue={managedStaff?.department ?? ''}
                error={errors.department}
            />
            <div className="sm:col-span-2">
                <FormDropdown
                    id="reporting_manager_id"
                    name="reporting_manager_id"
                    label="Reporting manager"
                    options={reportingManagers.map((m) => ({
                        value: String(m.id),
                        label: `${m.staff_number} — ${m.full_name}`,
                    }))}
                    defaultValue={
                        managedStaff?.reporting_manager_id !== undefined &&
                        managedStaff?.reporting_manager_id !== null
                            ? String(managedStaff.reporting_manager_id)
                            : ''
                    }
                    allowEmpty
                    emptyOptionLabel="— None —"
                    placeholder="— None —"
                    resetKey={managedStaff?.id ?? 'create'}
                    error={errors.reporting_manager_id}
                />
            </div>
            <FormInput
                label="Employment type"
                name="employment_type"
                placeholder="Full-time, part-time…"
                defaultValue={managedStaff?.employment_type ?? ''}
                error={errors.employment_type}
            />
            <FormInput
                label="Salary type"
                name="salary_type"
                defaultValue={managedStaff?.salary_type ?? ''}
                error={errors.salary_type}
            />
            <div className="space-y-1 sm:col-span-2">
                <FormInput
                    label="Assigned clinic(s)"
                    name="assigned_clinics_text"
                    placeholder="Main branch, Satellite clinic…"
                    defaultValue={(managedStaff?.assigned_clinics ?? []).join(', ')}
                    error={errors.assigned_clinics_text}
                />
                <p className="text-muted-foreground text-xs">Comma-separated clinic labels.</p>
            </div>
            <div className="sm:col-span-2">
                <FormDropdown
                    id="employment_status"
                    name="employment_status"
                    label="Employment status *"
                    options={[...EMPLOYMENT_STATUSES]}
                    defaultValue={managedStaff?.employment_status ?? 'active'}
                    allowEmpty={false}
                    placeholder="Search…"
                    required
                    resetKey={managedStaff?.id ?? 'create'}
                    error={errors.employment_status}
                />
            </div>
            <div className="sm:col-span-2">
                <FormStatusToggle
                    id="is_active_toggle"
                    name="is_active"
                    label="Staff active (employment)"
                    enabledText="Active"
                    disabledText="Inactive"
                    checked={isActive}
                    onChange={onIsActiveChange}
                />
            </div>
        </div>
    );
}
