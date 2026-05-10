import { Mail, Phone } from 'lucide-react';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

import { AccountStatusBadge } from './account-status-badge';
import { StaffStatusBadge } from './staff-status-badge';

import type { StaffMember } from '../types';

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

export function StaffHeader({
    staff,
    className,
    children,
}: {
    staff: StaffMember;
    className?: string;
    children?: ReactNode;
}) {
    return (
        <header
            className={cn(
                'border-border bg-card flex flex-col gap-6 rounded-2xl border p-6 shadow-sm md:flex-row md:items-start md:justify-between',
                className,
            )}
        >
            <div className="flex gap-4">
                <div className="bg-primary/10 text-primary flex size-20 shrink-0 items-center justify-center rounded-2xl text-xl font-semibold shadow-inner">
                    {staff.photo_path ? (
                        <img src={staff.photo_path} alt="" className="size-full rounded-2xl object-cover" />
                    ) : (
                        initials(staff.full_name)
                    )}
                </div>
                <div className="min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                        <h1 className="text-2xl font-semibold tracking-tight">{staff.full_name}</h1>
                        <StaffStatusBadge employmentStatus={staff.employment_status} />
                        <AccountStatusBadge enableLogin={staff.enable_login} isEnabled={staff.is_enabled} />
                    </div>
                    <p className="text-muted-foreground text-sm">
                        {staff.staff_number}
                        {staff.position ? ` · ${staff.position}` : ''}
                        {staff.department ? ` · ${staff.department}` : ''}
                    </p>
                    <div className="text-muted-foreground flex flex-wrap gap-4 text-sm">
                        {staff.mobile_number && (
                            <span className="inline-flex items-center gap-1.5">
                                <Phone className="size-4" />
                                {staff.mobile_number}
                            </span>
                        )}
                        {staff.email && (
                            <span className="inline-flex items-center gap-1.5">
                                <Mail className="size-4" />
                                {staff.email}
                            </span>
                        )}
                    </div>
                </div>
            </div>
            {children ? <div className="flex shrink-0 flex-wrap gap-2">{children}</div> : null}
        </header>
    );
}
