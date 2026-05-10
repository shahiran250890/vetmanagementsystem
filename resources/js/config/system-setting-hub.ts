import type { LucideIcon } from 'lucide-react';
import {
    Briefcase,
    Building,
    Building2,
    CreditCard,
    Database,
    FileText,
    FlaskConical,
    KeyRound,
    Mail,
    Pill,
    Scan,
    ScrollText,
    Shield,
    ShieldCheck,
    SlidersHorizontal,
    Stethoscope,
    UserCog,
    UsersRound,
} from 'lucide-react';

import type { NavSubItem } from '@/types';

const SETTINGS_PATHS = {
    staff: '/settings/system/users',
    roles: '/settings/system/roles',
    permissions: '/settings/system/permissions',
    organization: '/settings/system/organization',
    species: '/settings/system/species',
    systemSettings: '/settings/system/system-settings',
} as const;

const ADMIN_PLACEHOLDER_ROLES = ['admin', 'superadmin'] as const;

export const SYSTEM_SETTING_HUB_PATH = '/settings/system';

export type SystemSettingModuleCard = NavSubItem & {
    description: string;
    icon: LucideIcon;
};

/**
 * Full system configuration modules for the hub page and sidebar visibility rules.
 */
export function getSystemSettingModules(
    organizationClinicType: 'vet' | 'human' | null,
): SystemSettingModuleCard[] {
    const items: SystemSettingModuleCard[] = [
        {
            title: 'Staff Management',
            href: SETTINGS_PATHS.staff,
            description:
                'Staff directory, employment profiles, and optional login accounts with roles.',
            icon: UsersRound,
            permissions: ['settings.system.users.view', 'view user'],
        },
        {
            title: 'Roles',
            href: SETTINGS_PATHS.roles,
            description: 'Define roles and bundle permissions for your organization.',
            icon: UserCog,
            permissions: ['settings.system.roles.view', 'view role'],
        },
        {
            title: 'Permissions',
            href: SETTINGS_PATHS.permissions,
            description: 'Review and manage permission keys available in the system.',
            icon: ShieldCheck,
            permissions: ['settings.system.permissions.view', 'view permission'],
        },
        {
            title: 'Clinic Information',
            href: SETTINGS_PATHS.organization,
            description: 'Organization profile, branding, and clinic contact details.',
            icon: Building2,
            permissions: ['settings.system.system_settings.view', 'view system setting'],
        },
    ];

    if (organizationClinicType !== 'human') {
        items.push({
            title: 'Species',
            href: SETTINGS_PATHS.species,
            description: 'Configure species lists used for patient registration.',
            icon: KeyRound,
            permissions: ['settings.system.species.view', 'view species'],
        });
    }

    items.push(
        {
            title: 'System settings',
            href: SETTINGS_PATHS.systemSettings,
            description: 'Key–value settings for operational behaviour and defaults.',
            icon: SlidersHorizontal,
            permissions: ['settings.system.system_settings.view', 'view system setting'],
        },
        {
            title: 'Departments',
            href: '#',
            comingSoon: true,
            description: 'Organize staff and services by department.',
            icon: Building,
            roles: [...ADMIN_PLACEHOLDER_ROLES],
        },
        {
            title: 'Positions',
            href: '#',
            comingSoon: true,
            description: 'Job titles and reporting lines.',
            icon: Briefcase,
            roles: [...ADMIN_PLACEHOLDER_ROLES],
        },
        {
            title: 'Payment Methods',
            href: '#',
            comingSoon: true,
            description: 'Accepted tenders, cards, and settlement options.',
            icon: CreditCard,
            roles: [...ADMIN_PLACEHOLDER_ROLES],
        },
        {
            title: 'Services',
            href: '#',
            comingSoon: true,
            description: 'Service catalogue, pricing hooks, and booking availability.',
            icon: Stethoscope,
            roles: [...ADMIN_PLACEHOLDER_ROLES],
        },
        {
            title: 'Diagnosis Codes',
            href: '#',
            comingSoon: true,
            description: 'Clinical coding sets for diagnoses and billing alignment.',
            icon: FileText,
            roles: [...ADMIN_PLACEHOLDER_ROLES],
        },
        {
            title: 'Medication Master',
            href: '#',
            comingSoon: true,
            description: 'Drug formulary, strengths, and default instructions.',
            icon: Pill,
            roles: [...ADMIN_PLACEHOLDER_ROLES],
        },
        {
            title: 'Laboratory Tests',
            href: '#',
            comingSoon: true,
            description: 'Lab panels, units, and reference ranges.',
            icon: FlaskConical,
            roles: [...ADMIN_PLACEHOLDER_ROLES],
        },
        {
            title: 'Imaging Tests',
            href: '#',
            comingSoon: true,
            description: 'Imaging modalities and study templates.',
            icon: Scan,
            roles: [...ADMIN_PLACEHOLDER_ROLES],
        },
        {
            title: 'Insurance Panels',
            href: '#',
            comingSoon: true,
            description: 'Insurers, coverage tiers, and panel pricing.',
            icon: Shield,
            roles: [...ADMIN_PLACEHOLDER_ROLES],
        },
        {
            title: 'Notification Templates',
            href: '#',
            comingSoon: true,
            description: 'Email and SMS templates for appointments and reminders.',
            icon: Mail,
            roles: [...ADMIN_PLACEHOLDER_ROLES],
        },
        {
            title: 'Audit Logs',
            href: '#',
            comingSoon: true,
            description: 'Security and compliance trail for sensitive actions.',
            icon: ScrollText,
            roles: [...ADMIN_PLACEHOLDER_ROLES],
        },
        {
            title: 'Backup & Restore',
            href: '#',
            comingSoon: true,
            description: 'Data export, backups, and disaster recovery.',
            icon: Database,
            roles: [...ADMIN_PLACEHOLDER_ROLES],
        },
    );

    return items;
}

function toNavSubItem(module: SystemSettingModuleCard): NavSubItem {
    return {
        title: module.title,
        href: module.href,
        roles: module.roles,
        permissions: module.permissions,
        comingSoon: module.comingSoon,
        externalDocument: module.externalDocument,
    };
}

/** Children shape used by {@link filterNavItemsByAuth} for the System Setting sidebar link. */
export function getSystemSettingSubItems(
    organizationClinicType: 'vet' | 'human' | null,
): NavSubItem[] {
    return getSystemSettingModules(organizationClinicType).map(toNavSubItem);
}
