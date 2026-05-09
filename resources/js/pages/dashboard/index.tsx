import { Head } from '@inertiajs/react';

import { PageHeader } from '@/components/page-header';
import { DashboardDataProvider } from '@/hooks/use-dashboard-data';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

import { MyScheduleWidget } from './widgets/my-schedule';
import { RecentRevenueWidget } from './widgets/recent-revenue';
import { TodayAppointmentsWidget } from './widgets/today-appointments';
import { TotalPatientsWidget } from './widgets/total-patients';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
    },
];

export default function DashboardPage({
    dashboardWidgets = [],
}: {
    dashboardWidgets?: string[];
}) {
    const widgetIds = dashboardWidgets;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <DashboardDataProvider widgetIds={widgetIds}>
                <div className="space-y-8">
                    <PageHeader
                        variant="gradient"
                        breadcrumbs={breadcrumbs}
                        title="Dashboard"
                        description="Overview of clinic activity and key metrics."
                    />

                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {widgetIds.includes('total_patients') ? (
                            <TotalPatientsWidget />
                        ) : null}
                        {widgetIds.includes('today_appointments') ? (
                            <TodayAppointmentsWidget />
                        ) : null}
                        {widgetIds.includes('recent_revenue') ? (
                            <RecentRevenueWidget />
                        ) : null}
                    </div>

                    {widgetIds.includes('my_schedule') ? (
                        <div className="max-w-3xl">
                            <MyScheduleWidget />
                        </div>
                    ) : null}
                </div>
            </DashboardDataProvider>
        </AppLayout>
    );
}
