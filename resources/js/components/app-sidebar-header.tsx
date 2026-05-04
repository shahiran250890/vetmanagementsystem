import { Form } from '@inertiajs/react';
import { Bell, Search } from 'lucide-react';

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
    return (
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b border-border/60 bg-background/85 px-3 shadow-sm backdrop-blur-xl supports-[backdrop-filter]:bg-background/70 sm:gap-3 sm:px-4 md:px-5">
            <SidebarTrigger className="shrink-0 border-border/60 bg-card/50 text-foreground shadow-sm" />

            <div className="min-w-0 flex-1 overflow-hidden">
                <Breadcrumbs breadcrumbs={breadcrumbs} />
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
                        className="h-9 border-border/60 bg-muted/40 pr-3 pl-9 text-sm text-foreground shadow-none placeholder:text-muted-foreground"
                        aria-label="Search patients"
                    />
                </div>
            </Form>

            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                <button
                    type="button"
                    className="text-muted-foreground hover:text-foreground hidden size-9 items-center justify-center rounded-lg border border-transparent transition-colors hover:border-border/80 hover:bg-muted/50 sm:inline-flex"
                    aria-label="Notifications"
                >
                    <Bell className="size-4" />
                </button>
                <AppToolbarUser />
            </div>
        </header>
    );
}
