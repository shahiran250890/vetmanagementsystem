import { Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useDashboardData } from '@/hooks/use-dashboard-data';
import { CalendarDays } from '@/lib/app-icons';

export function MyScheduleWidget() {
    const { loading, mySchedule } = useDashboardData();

    return (
        <Card
            className="transform-gpu shadow-sm transition-all duration-200 ease-in-out will-change-transform hover:scale-[1.02] hover:shadow-md motion-reduce:hover:scale-100 active:scale-[0.99] motion-reduce:active:scale-100"
            data-testid="dashboard-widget-my-schedule"
        >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 px-6 pb-2">
                <div className="flex items-center gap-3">
                    <span
                        className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 ring-1 ring-indigo-500/15 dark:bg-indigo-400/10 dark:text-indigo-300 dark:ring-indigo-400/20"
                        aria-hidden
                    >
                        <CalendarDays className="size-5" />
                    </span>
                    <p className="text-sm font-medium text-muted-foreground">
                        My schedule
                    </p>
                </div>
                <Link
                    href="/appointments"
                    prefetch
                    className="text-primary text-sm font-medium hover:underline"
                >
                    View all
                </Link>
            </CardHeader>
            <CardContent className="pt-0">
                {loading ? (
                    <div className="mt-2 space-y-3">
                        <Skeleton className="h-4 w-full max-w-md" />
                        <Skeleton className="h-4 w-full max-w-sm" />
                        <Skeleton className="h-4 w-3/4 max-w-xs" />
                    </div>
                ) : !mySchedule?.length ? (
                    <p className="mt-2 text-sm text-muted-foreground">
                        No upcoming appointments in the next week.
                    </p>
                ) : (
                    <ul className="mt-2 space-y-2 text-sm text-foreground">
                        {mySchedule.slice(0, 8).map((a) => (
                            <li
                                key={a.id}
                                className="flex justify-between gap-2 border-b border-border/60 py-1.5 last:border-0"
                            >
                                <span className="font-medium tabular-nums">
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
            </CardContent>
        </Card>
    );
}
