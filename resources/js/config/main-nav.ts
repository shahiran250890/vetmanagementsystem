import {
    CalendarDays,
    HeartPulse,
    LayoutGrid,
    NotebookPen,
    Receipt,
} from 'lucide-react';

import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

export const mainNav: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
        group: 'Overview',
    },
    {
        title: 'Patients',
        href: '/patients',
        icon: HeartPulse,
        group: 'Clinical',
        roles: ['admin', 'superadmin', 'doctor', 'receptionist', 'nurse'],
    },
    {
        title: 'Appointments',
        href: '/appointments',
        icon: CalendarDays,
        group: 'Clinical',
        roles: ['admin', 'superadmin', 'doctor', 'receptionist'],
    },
    {
        title: 'Medical records',
        href: '/medical-records',
        icon: NotebookPen,
        group: 'Clinical',
        roles: ['admin', 'superadmin', 'doctor'],
    },
    {
        title: 'Billing',
        href: '/bills',
        icon: Receipt,
        group: 'Finance',
        roles: ['admin', 'superadmin', 'receptionist'],
    },
];

export function isNavItemVisible(
    item: NavItem,
    userRoles: string[],
    userPermissions: string[],
): boolean {
    if (item.roles?.length) {
        const allowed = item.roles.some((r) => userRoles.includes(r));

        if (!allowed) {
            return false;
        }
    }

    if (item.permissions?.length) {
        const allowed = item.permissions.some((p) =>
            userPermissions.includes(p),
        );

        if (!allowed) {
            return false;
        }
    }

    return true;
}
