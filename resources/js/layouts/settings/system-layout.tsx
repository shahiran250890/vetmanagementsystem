import { Head } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import { systemSettingsNav } from '@/config/settings-nav';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import type { BreadcrumbItem } from '@/types';

type SystemLayoutProps = PropsWithChildren<{
    pageTitle: string;
    breadcrumbs: BreadcrumbItem[];
    contentClassName?: string;
}>;

export default function SystemLayout({
    pageTitle,
    breadcrumbs,
    contentClassName = 'max-w-none',
    children,
}: SystemLayoutProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={pageTitle} />
            <SettingsLayout
                title="System Setting"
                description="Manage internal system modules."
                navItems={systemSettingsNav}
                contentClassName={contentClassName}
            >
                {children}
            </SettingsLayout>
        </AppLayout>
    );
}
