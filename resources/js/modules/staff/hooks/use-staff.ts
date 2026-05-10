import { router } from '@inertiajs/react';

import usersRoutes from '@/routes/settings/system/users';

import type { StaffFilters } from '../types';

export function staffIndexUrl(filters: StaffFilters, page = 1): string {
    const perPage = filters.per_page ?? 10;

    return usersRoutes.index.url({
        query: {
            search: filters.search || undefined,
            sort: filters.sort || undefined,
            direction: filters.direction || undefined,
            role_id: filters.role_id ?? undefined,
            department: filters.department || undefined,
            employment_status: filters.employment_status || undefined,
            clinic: filters.clinic || undefined,
            page,
            per_page: perPage,
        },
    });
}

export function navigateStaffIndex(filters: StaffFilters, page = 1): void {
    router.get(staffIndexUrl(filters, page), {}, { preserveState: true, preserveScroll: true, replace: true });
}
