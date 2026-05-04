import { Link } from '@inertiajs/react';

import { useDashboardData } from '@/hooks/use-dashboard-data';

export function MyScheduleWidget() {
    const { loading, mySchedule } = useDashboardData();

    return (
        <div
            className="rounded-2xl border border-border/80 bg-card p-6 text-card-foreground shadow-sm"
            data-testid="dashboard-widget-my-schedule"
        >
            <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-muted-foreground">My schedule</p>
                <Link
                    href="/appointments"
                    prefetch
                    className="text-sm font-medium text-primary hover:underline"
                >
                    View all
                </Link>
            </div>
            {loading ? (
                <p className="mt-4 text-sm text-muted-foreground">Loading…</p>
            ) : !mySchedule?.length ? (
                <p className="mt-4 text-sm text-muted-foreground">
                    No upcoming appointments in the next week.
                </p>
            ) : (
                <ul className="mt-4 space-y-2 text-sm text-foreground">
                    {mySchedule.slice(0, 8).map((a) => (
                        <li
                            key={a.id}
                            className="flex justify-between gap-2 border-b border-border/60 py-1 last:border-0"
                        >
                            <span className="font-medium">
                                {a.appointment_datetime
                                    ?.replace('T', ' ')
                                    .slice(0, 16) ?? '—'}
                            </span>
                            <span className="truncate text-muted-foreground">
                                {a.patient?.name ?? `#${a.patient_id}`}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
