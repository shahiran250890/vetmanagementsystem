import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type FormGridProps = {
    children: ReactNode;
    className?: string;
};

/**
 * Responsive form layout: single column on small screens, two columns from md up.
 */
export function FormGrid({ children, className }: FormGridProps) {
    return (
        <div
            className={cn(
                'grid gap-6 md:grid-cols-2 md:gap-x-8 md:gap-y-6',
                className,
            )}
        >
            {children}
        </div>
    );
}
