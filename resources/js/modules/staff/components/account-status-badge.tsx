import { cn } from '@/lib/utils';

/**
 * Reflects {@link User.is_enabled} for staff with a linked login account.
 */
export function AccountStatusBadge({
    enableLogin,
    isEnabled,
    className,
}: {
    /** Whether a User row exists for this staff member. */
    enableLogin: boolean;
    /** When a user exists, whether sign-in is allowed (`users.is_enabled`). */
    isEnabled: boolean;
    className?: string;
}) {
    if (!enableLogin) {
        return (
            <span
                className={cn(
                    'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
                    'bg-muted text-muted-foreground',
                    className,
                )}
            >
                No account
            </span>
        );
    }

    return (
        <span
            className={cn(
                'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
                isEnabled
                    ? 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300'
                    : 'bg-rose-500/15 text-rose-700 dark:text-rose-400',
                className,
            )}
        >
            {isEnabled ? 'Enabled' : 'Disabled'}
        </span>
    );
}
