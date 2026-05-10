import { cn } from '@/lib/utils';

const LABELS: Record<string, string> = {
    active: 'Active',
    on_leave: 'On leave',
    probation: 'Probation',
    suspended: 'Suspended',
    resigned: 'Resigned',
    terminated: 'Terminated',
};

export function StaffStatusBadge({
    employmentStatus,
    className,
}: {
    employmentStatus: string;
    className?: string;
}) {
    const label = LABELS[employmentStatus] ?? employmentStatus;

    const tone =
        employmentStatus === 'active'
            ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
            : employmentStatus === 'on_leave' || employmentStatus === 'probation'
              ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300'
              : employmentStatus === 'suspended'
                ? 'bg-orange-500/15 text-orange-800 dark:text-orange-300'
                : 'bg-muted text-muted-foreground';

    return (
        <span className={cn('inline-flex rounded-full px-2 py-0.5 text-xs font-medium', tone, className)}>
            {label}
        </span>
    );
}
