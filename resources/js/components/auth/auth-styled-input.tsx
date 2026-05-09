import type { ComponentProps } from 'react';

import PasswordInput from '@/components/password-input';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const authInputClassName = cn(
    'h-11 rounded-xl border-slate-200/90 bg-white/90 shadow-sm transition-all',
    'dark:border-zinc-700/80 dark:bg-zinc-900/70',
    'focus-visible:border-indigo-500/80 focus-visible:ring-[3px] focus-visible:ring-indigo-500/20',
    'dark:focus-visible:border-indigo-400/70 dark:focus-visible:ring-indigo-400/15',
);

export function AuthTextInput({
    className,
    ...props
}: ComponentProps<typeof Input>) {
    return (
        <Input className={cn(authInputClassName, className)} {...props} />
    );
}

export function AuthPasswordInput({
    className,
    ...props
}: ComponentProps<typeof PasswordInput>) {
    return (
        <PasswordInput
            className={cn(authInputClassName, className)}
            {...props}
        />
    );
}
