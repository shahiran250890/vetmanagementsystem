import { FormInput } from '@/components/form-input';

import type { StaffMember } from '../types';

export function ScheduleSection({ managedStaff }: { managedStaff?: StaffMember }) {
    return (
        <div className="grid gap-4">
            <FormInput
                label="Working hours"
                name="working_hours"
                placeholder="e.g. Mon–Fri 09:00–18:00"
                defaultValue={managedStaff?.working_hours ?? ''}
            />
            <p className="text-muted-foreground text-sm">
                Describe regular shifts or roster notes. Advanced scheduling can integrate here later.
            </p>
        </div>
    );
}
