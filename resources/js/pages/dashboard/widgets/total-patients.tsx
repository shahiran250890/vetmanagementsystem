import { StatCard } from '@/components/stat-card';
import { useDashboardData } from '@/hooks/use-dashboard-data';
import { Users } from '@/lib/app-icons';

export function TotalPatientsWidget() {
    const { loading, patientTotal } = useDashboardData();

    return (
        <StatCard
            icon={Users}
            label="Total patients"
            description="All registered patients"
            value={patientTotal ?? '—'}
            loading={loading}
            href="/patients"
            data-testid="dashboard-widget-total-patients"
        />
    );
}
