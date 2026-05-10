import {
    BarChart3,
    CalendarDays,
    HeartPulse,
    LayoutGrid,
    NotebookPen,
    Receipt,
    Settings,
} from 'lucide-react';

import {
    SYSTEM_SETTING_HUB_PATH,
    getSystemSettingSubItems,
} from '@/config/system-setting-hub';
import { dashboard } from '@/routes';
import type { NavLeafItem, NavSubItem } from '@/types';

const ADMIN_PLACEHOLDER_ROLES = ['admin', 'superadmin'] as const;

/** Full access to the system settings area in the UI (hub cards; routes still enforce server-side). */
const SYSTEM_SETTINGS_ADMIN_ROLES = ['admin', 'superadmin'] as const;

/** Full primary sidebar navigation for the authenticated shell. */
export function getMainNavItems(): NavLeafItem[] {
    const items: NavLeafItem[] = [
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
        {
            title: 'Reports',
            href: '#',
            icon: BarChart3,
            group: 'Insights',
            comingSoon: true,
            roles: [...ADMIN_PLACEHOLDER_ROLES],
        },
        {
            title: 'System Setting',
            href: SYSTEM_SETTING_HUB_PATH,
            activeWhenPrefix: SYSTEM_SETTING_HUB_PATH,
            icon: Settings,
            group: 'Administration',
        },
    ];

    return items;
}

/** @deprecated Use {@link getMainNavItems} with clinic type from the server. */
export const mainNav: NavLeafItem[] = getMainNavItems();

function matchesRolesAndPermissions(
    item:
        | Pick<NavLeafItem, 'roles' | 'permissions'>
        | Pick<NavSubItem, 'roles' | 'permissions'>,
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
        const allowed = item.permissions.some((p) => userPermissions.includes(p));

        if (!allowed) {
            return false;
        }
    }

    return true;
}

export function isNavSubItemVisible(
    item: NavSubItem,
    userRoles: string[],
    userPermissions: string[],
): boolean {
    return matchesRolesAndPermissions(item, userRoles, userPermissions);
}

/**
 * Visibility for System Setting hub cards and the sidebar System Setting link.
 * Implemented routes ({@link NavSubItem.href} !== `#`) are shown to org admins even when
 * granular permission names are not mirrored on the client, so admins still see Staff,
 * Roles, and Permissions alongside permission-only users.
 */
export function isSystemSettingHubModuleVisible(
    item: NavSubItem,
    userRoles: string[],
    userPermissions: string[],
): boolean {
    const isOrgAdmin = SYSTEM_SETTINGS_ADMIN_ROLES.some((r) => userRoles.includes(r));

    if (item.href !== '#' && isOrgAdmin) {
        return true;
    }

    return isNavSubItemVisible(item, userRoles, userPermissions);
}

export function isNavItemVisible(
    item: NavLeafItem,
    userRoles: string[],
    userPermissions: string[],
): boolean {
    return matchesRolesAndPermissions(item, userRoles, userPermissions);
}

/**
 * Filter navigation items; the System Setting hub is shown when any configuration module is visible.
 */
export function filterNavItemsByAuth(
    items: NavLeafItem[],
    userRoles: string[],
    userPermissions: string[],
    organizationClinicType: 'vet' | 'human' | null = null,
): NavLeafItem[] {
    return items
        .map((item) => {
            if (item.href === SYSTEM_SETTING_HUB_PATH) {
                const anyChildVisible = getSystemSettingSubItems(organizationClinicType).some(
                    (child) =>
                        isSystemSettingHubModuleVisible(child, userRoles, userPermissions),
                );

                return anyChildVisible ? item : null;
            }

            return isNavItemVisible(item, userRoles, userPermissions) ? item : null;
        })
        .filter((item): item is NavLeafItem => item !== null);
}
