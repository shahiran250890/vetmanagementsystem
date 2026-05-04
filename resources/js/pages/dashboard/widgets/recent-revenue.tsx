import { Link } from '@inertiajs/react';

import { useDashboardData } from '@/hooks/use-dashboard-data';

export function RecentRevenueWidget() {
    const { loading, recentRevenue } = useDashboardData();

    return (
        <Link
            href="/bills"
            prefetch
            className="group rounded-2xl border border-border/80 bg-card p-6 text-card-foreground shadow-sm transition hover:border-primary/50 hover:shadow-md"
            data-testid="dashboard-widget-recent-revenue"
        >
            <p className="text-sm font-medium text-muted-foreground">
                Paid revenue (recent)
            </p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-foreground tabular-nums">
                {loading ? '…' : `RM ${(recentRevenue ?? 0).toFixed(2)}`}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
                Sum of last 50 paid bills (sample window)
            </p>
            <span className="mt-4 inline-block text-sm font-medium text-primary group-hover:underline">
                Open
            </span>
        </Link>
    );
}
