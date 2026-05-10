import { FormInput } from '@/components/form-input';
import FormStatusToggle from '@/components/form-status-toggle';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';

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

const nativeSelectClassName =
    'border-input bg-background ring-offset-background focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50';

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
            <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="reporting_manager_id">Reporting manager</Label>
                <select
                    id="reporting_manager_id"
                    name="reporting_manager_id"
                    className={nativeSelectClassName}
                    defaultValue={managedStaff?.reporting_manager_id ?? ''}
                >
                    <option value="">— None —</option>
                    {reportingManagers.map((m) => (
                        <option key={m.id} value={m.id}>
                            {m.staff_number} — {m.full_name}
                        </option>
                    ))}
                </select>
                <InputError message={errors.reporting_manager_id} />
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
            <div className="grid gap-2 sm:col-span-2">
                <Label htmlFor="employment_status">Employment status *</Label>
                <select
                    id="employment_status"
                    name="employment_status"
                    aria-required="true"
                    className={nativeSelectClassName}
                    defaultValue={managedStaff?.employment_status ?? 'active'}
                >
                    {EMPLOYMENT_STATUSES.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                <InputError message={errors.employment_status} />
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
