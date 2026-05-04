import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type ListPageFiltersProps = {
    children: ReactNode;
    className?: string;
};

/**
 * Full-width filter bar shell shared across list pages for consistent layout and theming.
 */
export function ListPageFilters({ children, className }: ListPageFiltersProps) {
    return (
        <div
            className={cn(
                'w-full rounded-lg border border-border bg-card p-4 text-card-foreground shadow-sm',
                className,
            )}
        >
            {children}
        </div>
    );
}
