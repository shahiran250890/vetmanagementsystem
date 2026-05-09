import { StatCard } from '@/components/stat-card';
import { useDashboardData } from '@/hooks/use-dashboard-data';
import { CalendarClock } from '@/lib/app-icons';

export function TodayAppointmentsWidget() {
    const { loading, todayAppointmentCount } = useDashboardData();

    return (
        <StatCard
            icon={CalendarClock}
            label="Today's appointments"
            description="Scheduled for today"
            value={todayAppointmentCount ?? '—'}
            loading={loading}
            href="/appointments"
            data-testid="dashboard-widget-today-appointments"
        />
    );
}
