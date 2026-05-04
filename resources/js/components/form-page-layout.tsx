import { Link } from '@inertiajs/react';
import type { InertiaLinkProps } from '@inertiajs/react';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

/** Card surface for primary full-page forms (theme-aware for light/dark) */
export const formPageSurfaceClassName =
    'rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-sm';

/** Native select styling aligned with the shared Input control */
export const nativeSelectClassName = cn(
    'flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-sm text-foreground shadow-xs',
    'transition-[color,box-shadow] outline-none',
    'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-70',
);

/** Native textarea styling aligned with text fields */
export const nativeTextareaClassName = cn(
    'min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm text-foreground shadow-xs',
    'placeholder:text-muted-foreground',
    'transition-[color,box-shadow] outline-none',
    'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
    'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-70',
);

/** Typical vertical rhythm inside a single-column form card */
export const formPageFormStackClassName = 'space-y-5';

export const formPageFormClassName = cn(
    formPageSurfaceClassName,
    formPageFormStackClassName,
);

/** Primary full-width submit control on clinic form pages */
export const formPagePrimarySubmitClassName =
    'w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-70';

/** Nested field groups inside larger forms (e.g. patient profile sections) */
export const formPageInsetSectionClassName =
    'rounded-xl border border-border bg-muted/50 p-4 dark:bg-muted/25';

const maxWidthMap = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    full: 'max-w-full',
} as const;

export type FormPageMaxWidth = keyof typeof maxWidthMap;

type FormPageContentProps = {
    title: string;
    backHref: NonNullable<InertiaLinkProps['href']>;
    backLabel?: string;
    maxWidth?: FormPageMaxWidth;
    beforeChildren?: ReactNode;
    children: ReactNode;
    className?: string;
};

/**
 * Shared header + page-width wrapper for standalone app forms
 * (used inside {@link AppLayout} after {@link Head}). Defaults to full content width;
 * pass `maxWidth` when a narrower column is intentional.
 */
export function FormPageContent({
    title,
    backHref,
    backLabel = 'Cancel',
    maxWidth = 'full',
    beforeChildren,
    children,
    className,
}: FormPageContentProps) {
    return (
        <div
            className={cn(
                'w-full min-w-0 space-y-6',
                maxWidth !== 'full' && 'mx-auto',
                maxWidthMap[maxWidth],
                className,
            )}
        >
            <div className="flex items-center justify-between gap-4">
                <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
                <Link
                    href={backHref}
                    className="shrink-0 text-sm text-muted-foreground transition-colors hover:text-foreground hover:underline"
                >
                    {backLabel}
                </Link>
            </div>
            {beforeChildren}
            {children}
        </div>
    );
}
