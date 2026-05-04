import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

/** Shared horizontal rhythm + max width for all authenticated module pages. */
export const appMainInnerClassName =
    'relative mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:py-8';

type AppMainProps = {
    children: ReactNode;
    className?: string;
};

/**
 * Primary scroll region under {@link AppSidebarHeader}: one consistent canvas
 * for dashboard, clinical modules, billing, and settings.
 */
export function AppMain({ children, className }: AppMainProps) {
    return (
        <div
            className={cn(
                'relative flex-1 overflow-x-hidden bg-gradient-to-b from-primary/[0.08] via-background to-background',
                className,
            )}
        >
            <div className={appMainInnerClassName}>{children}</div>
        </div>
    );
}
