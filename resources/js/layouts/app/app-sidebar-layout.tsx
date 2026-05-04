import { AppContent } from '@/components/app-content';
import { AppMain } from '@/components/app-main';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import type { AppLayoutProps } from '@/types';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar" className="flex min-h-0 flex-1 flex-col overflow-x-hidden">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                <AppMain>{children}</AppMain>
            </AppContent>
        </AppShell>
    );
}
