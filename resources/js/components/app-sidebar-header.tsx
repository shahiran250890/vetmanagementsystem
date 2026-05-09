import { Form } from '@inertiajs/react';
import { Bell, Search } from 'lucide-react';
import { useMemo } from 'react';

import { AppToolbarUser } from '@/components/app-toolbar-user';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { index as patientsIndex } from '@/routes/patients';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const pageTitle = useMemo(() => {
        if (breadcrumbs.length === 0) {
            return 'Dashboard';
        }

        return breadcrumbs[breadcrumbs.length - 1].title;
    }, [breadcrumbs]);

    return (
        <header className="sticky top-0 z-20 flex min-h-14 shrink-0 flex-wrap items-center gap-2 border-b border-border/50 bg-background/80 px-3 py-2 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-background/65 sm:gap-3 sm:px-4 md:px-5">
            <SidebarTrigger className="shrink-0 border-border/60 bg-card/60 text-foreground shadow-sm transition duration-200 ease-in-out hover:bg-muted/40" />

            <div className="min-w-0 flex-1 overflow-hidden">
                {breadcrumbs.length > 0 ? (
                    <div
                        className="[&_[data-slot=breadcrumb-list]]:text-sm [&_[data-slot=breadcrumb-page]]:text-foreground [&_[data-slot=breadcrumb-page]]:text-base [&_[data-slot=breadcrumb-page]]:font-semibold md:[&_[data-slot=breadcrumb-page]]:text-lg"
                    >
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                ) : (
                    <p className="text-foreground text-base font-semibold tracking-tight md:text-lg">
                        {pageTitle}
                    </p>
                )}
            </div>

            <Form
                action={patientsIndex.url()}
                method="get"
                className="mx-auto hidden min-w-0 max-w-md flex-1 lg:block"
            >
                <div className="relative">
                    <Search
                        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                        aria-hidden
                    />
                    <Input
                        name="search"
                        placeholder="Search patients…"
                        className="h-10 rounded-xl border-border/60 bg-muted/35 pr-3 pl-10 text-sm text-foreground shadow-none transition duration-200 ease-in-out placeholder:text-muted-foreground focus-visible:border-indigo-500/40 focus-visible:ring-indigo-500/25"
                        aria-label="Search patients"
                    />
                </div>
            </Form>

            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                <button
                    type="button"
                    className="text-muted-foreground hover:text-foreground hidden size-10 items-center justify-center rounded-xl border border-transparent transition duration-200 ease-in-out hover:border-border/70 hover:bg-muted/45 sm:inline-flex"
                    aria-label="Notifications"
                >
                    <Bell className="size-4" />
                </button>
                <AppToolbarUser />
            </div>
        </header>
    );
}
