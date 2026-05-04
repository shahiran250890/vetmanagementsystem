import { Link } from '@inertiajs/react';

import { useDashboardData } from '@/hooks/use-dashboard-data';

export function TotalPatientsWidget() {
    const { loading, patientTotal } = useDashboardData();

    return (
        <Link
            href="/patients"
            prefetch
            className="group rounded-2xl border border-border/80 bg-card p-6 text-card-foreground shadow-sm transition hover:border-primary/50 hover:shadow-md"
            data-testid="dashboard-widget-total-patients"
        >
            <p className="text-sm font-medium text-muted-foreground">Total patients</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground tabular-nums">
                {loading ? '…' : (patientTotal ?? '—')}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">All registered patients</p>
            <span className="mt-4 inline-block text-sm font-medium text-primary group-hover:underline">
                Open
            </span>
        </Link>
    );
}
