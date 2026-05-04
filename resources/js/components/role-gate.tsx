import type { ReactNode } from 'react';

import { useAuthRoles } from '@/hooks/use-auth-roles';

type Props = {
    anyOf?: string[];
    hideFor?: string[];
    children: ReactNode;
    fallback?: ReactNode;
};

export function RoleGate({
    anyOf,
    hideFor,
    children,
    fallback = null,
}: Props) {
    const { hasAnyRole, auth } = useAuthRoles();

    if (!auth.user) {
        return fallback;
    }

    if (hideFor?.some((r) => hasAnyRole(r))) {
        return fallback;
    }

    if (anyOf && anyOf.length > 0 && !anyOf.some((r) => hasAnyRole(r))) {
        return fallback;
    }

    return children;
}
