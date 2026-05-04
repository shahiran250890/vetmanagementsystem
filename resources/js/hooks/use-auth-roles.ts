import { usePage } from '@inertiajs/react';
import { useCallback, useMemo } from 'react';

import type { Auth } from '@/types/auth';

export function useAuthRoles(): {
    roles: string[];
    permissions: string[];
    hasRole: (...names: string[]) => boolean;
    hasAnyRole: (...names: string[]) => boolean;
    hasAnyPermission: (...names: string[]) => boolean;
    auth: Auth;
} {
    const { auth } = usePage<{ auth: Auth }>().props;

    const roles = useMemo(() => auth.roles ?? [], [auth.roles]);
    const permissions = useMemo(
        () => auth.permissions ?? [],
        [auth.permissions],
    );

    const hasRole = useCallback(
        (...names: string[]) => {
            return names.some((n) => roles.includes(n));
        },
        [roles],
    );

    const hasAnyRole = useCallback(
        (...names: string[]) => {
            return names.some((n) => roles.includes(n));
        },
        [roles],
    );

    const hasAnyPermission = useCallback(
        (...names: string[]) => {
            return names.some((n) => permissions.includes(n));
        },
        [permissions],
    );

    return {
        roles,
        permissions,
        hasRole,
        hasAnyRole,
        hasAnyPermission,
        auth,
    };
}
