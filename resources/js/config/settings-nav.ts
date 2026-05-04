import { edit as editAppearance } from '@/routes/appearance';
import { edit as editProfile } from '@/routes/profile';
import { edit as editSecurity } from '@/routes/security';
import { index as settingsSystemHome } from '@/routes/settings/system';
import { edit as organizationEdit } from '@/routes/settings/system/organization';
import permissions from '@/routes/settings/system/permissions';
import roles from '@/routes/settings/system/roles';
import species from '@/routes/settings/system/species';
import { index as systemSettingsIndex } from '@/routes/settings/system/system-settings';
import users from '@/routes/settings/system/users';
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

export const systemSettingsNav = (organizationClinicType: 'vet' | 'human' | null = null): NavItem[] => [
    {
        title: 'Back',
        href: editProfile(),
        icon: null,
    },
    {
        title: 'System Home',
        href: settingsSystemHome(),
        icon: null,
    },
    {
        title: 'Users',
        href: users.index(),
        icon: null,
    },
    {
        title: 'Roles',
        href: roles.index(),
        icon: null,
    },
    {
        title: 'Permissions',
        href: permissions.index(),
        icon: null,
    },
    ...(organizationClinicType === 'human'
        ? []
        : [
              {
                  title: 'Species',
                  href: species.index(),
                  icon: null,
              },
          ]),
    {
        title: 'System Settings',
        href: systemSettingsIndex(),
        icon: null,
    },
    {
        title: 'Organization',
        href: organizationEdit(),
        icon: null,
    },
];

export const defaultSettingsNav: NavItem[] = [
    ...accountSettingsNav,
    {
        title: 'System Setting',
        href: settingsSystemHome(),
        icon: null,
    },
];
