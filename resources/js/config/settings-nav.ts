import { edit as editAppearance } from '@/routes/appearance';
import { edit as editProfile } from '@/routes/profile';
import { edit as editSecurity } from '@/routes/security';
import type { NavLeafItem } from '@/types';

export const accountSettingsNav: NavLeafItem[] = [
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

export const defaultSettingsNav: NavLeafItem[] = [...accountSettingsNav];
