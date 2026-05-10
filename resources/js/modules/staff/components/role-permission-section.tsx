import { Label } from '@/components/ui/label';

import type { StaffMember } from '../types';

type Role = { id: number; name: string };

export function RolePermissionSection({
    roles,
    managedStaff,
    formatRoleName,
}: {
    roles: Role[];
    managedStaff?: StaffMember;
    formatRoleName: (roleName: string) => string;
}) {
    const selected = new Set((managedStaff?.roles ?? []).map((r) => r.id));

    return (
        <div className="grid gap-2">
            <Label>Roles</Label>
            <p className="text-muted-foreground text-sm">
                Roles apply when a login account exists. Staff without an account can still be listed for HR purposes.
            </p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {roles.map((role) => (
                    <label key={role.id} className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
                        <input type="checkbox" name="role_ids[]" value={role.id} defaultChecked={selected.has(role.id)} />
                        {formatRoleName(role.name)}
                    </label>
                ))}
            </div>
        </div>
    );
}
