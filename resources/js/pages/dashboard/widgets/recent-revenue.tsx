import { StatCard } from '@/components/stat-card';
import { useDashboardData } from '@/hooks/use-dashboard-data';
import { CircleDollarSign } from '@/lib/app-icons';

export function RecentRevenueWidget() {
    const { loading, recentRevenue } = useDashboardData();

    return (
        <StatCard
            icon={CircleDollarSign}
            label="Paid revenue (recent)"
            description="Sum of last 50 paid bills (sample window)"
            value={`RM ${(recentRevenue ?? 0).toFixed(2)}`}
            loading={loading}
            href="/bills"
            data-testid="dashboard-widget-recent-revenue"
        />
    );
}
