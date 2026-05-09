import type { ReactNode } from 'react';

import { Breadcrumbs } from '@/components/breadcrumbs';
import { cn } from '@/lib/utils';
import type { BreadcrumbItem } from '@/types';

type PageHeaderProps = {
    title: string;
    description?: string;
    actions?: ReactNode;
    className?: string;
    /** Optional trail shown above the title (semantic nav). */
    breadcrumbs?: BreadcrumbItem[];
    /** `gradient` adds a soft hero background (e.g. dashboard). */
    variant?: 'default' | 'gradient';
};

/**
 * Consistent page heading block for module pages (title, optional subtitle, actions).
 */
export function PageHeader({
    title,
    description,
    actions,
    className,
    breadcrumbs = [],
    variant = 'default',
}: PageHeaderProps) {
    const inner = (
        <div
            className={cn(
                'flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between',
                variant === 'gradient' && 'relative z-10',
            )}
        >
            <div className="min-w-0 space-y-3">
                {breadcrumbs.length > 0 ? (
                    <div
                        className={cn(
                            '[&_[data-slot=breadcrumb-list]]:text-xs sm:[&_[data-slot=breadcrumb-list]]:text-sm',
                            '[&_[data-slot=breadcrumb-page]]:font-medium',
                            variant === 'gradient' &&
                                '[&_[data-slot=breadcrumb-link]]:text-indigo-700/90 dark:[&_[data-slot=breadcrumb-link]]:text-indigo-300/90',
                        )}
                    >
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                ) : null}
                <div className="space-y-1">
                    <h1 className="text-foreground text-2xl font-semibold tracking-tight">
                        {title}
                    </h1>
                    {description ? (
                        <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed">
                            {description}
                        </p>
                    ) : null}
                </div>
            </div>
            {actions ? (
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                    {actions}
                </div>
            ) : null}
        </div>
    );

    if (variant === 'gradient') {
        return (
            <div
                className={cn(
                    'relative overflow-hidden rounded-2xl border border-indigo-200/50 bg-gradient-to-br from-indigo-50/95 via-white to-sky-50/80 p-6 shadow-sm',
                    'dark:border-indigo-500/20 dark:from-indigo-950/50 dark:via-zinc-900/90 dark:to-sky-950/40',
                    className,
                )}
            >
                <div
                    className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full bg-indigo-400/15 blur-3xl dark:bg-indigo-500/10"
                    aria-hidden
                />
                <div
                    className="pointer-events-none absolute -bottom-24 -left-12 size-48 rounded-full bg-sky-400/15 blur-3xl dark:bg-sky-500/10"
                    aria-hidden
                />
                {inner}
            </div>
        );
    }

    return <div className={className}>{inner}</div>;
}
