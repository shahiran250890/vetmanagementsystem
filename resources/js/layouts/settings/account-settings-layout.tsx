import { Head } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import type { BreadcrumbItem } from '@/types';

type AccountSettingsLayoutProps = PropsWithChildren<{
    breadcrumbs: BreadcrumbItem[];
    headTitle: string;
}>;

/**
 * Same shell as system settings: {@link AppLayout} + {@link SettingsLayout}, so account
 * pages share gutters and navigation with every other authenticated module.
 */
export default function AccountSettingsLayout({
    breadcrumbs,
    headTitle,
    children,
}: AccountSettingsLayoutProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={headTitle} />
            <h1 className="sr-only">{headTitle}</h1>
            <SettingsLayout>{children}</SettingsLayout>
        </AppLayout>
    );
}
