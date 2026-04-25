import { edit as editAppearance } from '@/routes/appearance';
import { edit as editProfile } from '@/routes/profile';
import { edit as editSecurity } from '@/routes/security';
import type { NavItem } from '@/types';

export const accountSettingsNav: NavItem[] = [
    {
        title: 'Profile',
        href: editProfile(),
        icon: null,
    },
    {
        title: 'Security',
        href: editSecurity(),
        icon: null,
    },
    {
        title: 'Appearance',
        href: editAppearance(),
        icon: null,
    },
];

export const systemSettingsNav: NavItem[] = [
    {
        title: 'Back',
        href: '/settings',
        icon: null,
    },
    {
        title: 'System Home',
        href: '/settings/system',
        icon: null,
    },
    {
        title: 'Users',
        href: '/settings/system/users',
        icon: null,
    },
    {
        title: 'Roles',
        href: '/settings/system/roles',
        icon: null,
    },
    {
        title: 'Permissions',
        href: '/settings/system/permissions',
        icon: null,
    },
    {
        title: 'Species',
        href: '/settings/system/species',
        icon: null,
    },
    {
        title: 'System Settings',
        href: '/settings/system/system-settings',
        icon: null,
    },
];

export const defaultSettingsNav: NavItem[] = [
    ...accountSettingsNav,
    {
        title: 'System Setting',
        href: '/settings/system',
        icon: null,
    },
];
