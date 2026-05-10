import { Head } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';

import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
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
            <div className="w-full min-w-0">
                <Heading
                    title="System Setting"
                    description="Manage internal system modules."
                />
                <section className={cn('space-y-12', contentClassName)}>{children}</section>
            </div>
        </AppLayout>
    );
}
