import type { ReactNode } from 'react';

import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type AuthFormFieldProps = {
    id: string;
    label: string;
    error?: string;
    children: ReactNode;
    className?: string;
};

/**
 * Labeled field wrapper with server/client validation messaging for auth screens.
 */
export function AuthFormField({
    id,
    label,
    error,
    children,
    className,
}: AuthFormFieldProps) {
    const errorId = `${id}-error`;

    return (
        <div className={cn('grid gap-2', className)}>
            <Label htmlFor={id} className="text-sm font-medium text-foreground">
                {label}
            </Label>
            {children}
            {error ? (
                <p
                    id={errorId}
                    role="alert"
                    className="text-sm text-destructive"
                >
                    {error}
                </p>
            ) : null}
        </div>
    );
}
