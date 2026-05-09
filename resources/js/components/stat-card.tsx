import { Link } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export type StatCardTrend = {
    label: string;
    direction: 'up' | 'down' | 'neutral';
};

type StatCardProps = {
    icon: LucideIcon;
    label: string;
    description?: string;
    value: ReactNode;
    loading?: boolean;
    href?: string;
    actionLabel?: string;
    trend?: StatCardTrend;
    className?: string;
    'data-testid'?: string;
};

const trendColor: Record<StatCardTrend['direction'], string> = {
    up: 'text-emerald-600 dark:text-emerald-400',
    down: 'text-red-600 dark:text-red-400',
    neutral: 'text-muted-foreground',
};

/**
 * Dashboard metric tile with icon, optional link, and loading skeleton.
 */
export function StatCard({
    icon: Icon,
    label,
    description,
    value,
    loading,
    href,
    actionLabel = 'Open',
    trend,
    className,
    'data-testid': dataTestId,
}: StatCardProps) {
    const body = (
        <>
            <div className="flex items-start justify-between gap-3">
                <p className="text-muted-foreground text-sm font-medium">
                    {label}
                </p>
                <span
                    className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 ring-1 ring-indigo-500/15 dark:bg-indigo-400/10 dark:text-indigo-300 dark:ring-indigo-400/20"
                    aria-hidden
                >
                    <Icon className="size-5" />
                </span>
            </div>
            <div className="mt-4">
                {loading ? (
                    <Skeleton className="h-9 w-28 max-w-full" />
                ) : (
                    <p className="text-foreground text-3xl font-semibold tracking-tight tabular-nums">
                        {value}
                    </p>
                )}
            </div>
            {description ? (
                <p className="text-muted-foreground mt-2 text-xs leading-snug">
                    {description}
                </p>
            ) : null}
            {trend && !loading ? (
                <p
                    className={cn(
                        'mt-2 text-xs font-medium',
                        trendColor[trend.direction],
                    )}
                >
                    {trend.label}
                </p>
            ) : null}
            {href ? (
                <span className="text-primary mt-4 inline-block text-sm font-medium group-hover:underline">
                    {actionLabel}
                </span>
            ) : null}
        </>
    );

    const surface = cn(
        'rounded-2xl border border-border/80 bg-card p-6 text-card-foreground shadow-sm',
        'transform-gpu will-change-transform',
        'transition-all duration-200 ease-in-out',
        'hover:scale-[1.02] hover:border-indigo-500/25 hover:shadow-md',
        'motion-reduce:hover:scale-100',
        'active:scale-[0.99] motion-reduce:active:scale-100',
        'dark:hover:border-indigo-400/20',
        href && 'group block',
        className,
    );

    if (href) {
        return (
            <Link
                href={href}
                prefetch
                className={surface}
                data-testid={dataTestId}
            >
                {body}
            </Link>
        );
    }

    return (
        <div className={surface} data-testid={dataTestId}>
            {body}
        </div>
    );
}
