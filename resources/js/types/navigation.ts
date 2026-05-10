import type { InertiaLinkProps } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';

export type BreadcrumbItem = {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
};

/** Single entry inside a collapsible sidebar group (e.g. Settings). */
export type NavSubItem = {
    title: string;
    /** Use `#` for modules not yet implemented. */
    href: string;
    roles?: string[];
    permissions?: string[];
    /** Shows a small badge and toast behaviour for `#` routes. */
    comingSoon?: boolean;
    externalDocument?: boolean;
};

type NavItemBase = {
    title: string;
    icon?: LucideIcon | null;
    /** Groups items under a sidebar section label. */
    group?: string;
    /** When set, the user must have at least one of these roles. */
    roles?: string[];
    /** When set, the user must have at least one of these permissions. */
    permissions?: string[];
    isActive?: boolean;
};

/** Leaf link (Dashboard, Reports, etc.). */
export type NavLeafItem = NavItemBase & {
    href: NonNullable<InertiaLinkProps['href']>;
    /**
     * When set, the item is active when the current URL equals or is nested under this path
     * (e.g. `/settings/system` while viewing `/settings/system/users`).
     */
    activeWhenPrefix?: string;
    /**
     * When true, render a plain anchor so the browser performs a full document load.
     */
    externalDocument?: boolean;
    /** For leaf placeholder routes such as Reports. */
    comingSoon?: boolean;
};

/** Collapsible group with submenu links (e.g. Settings). */
export type NavGroupItem = NavItemBase & {
    children: NavSubItem[];
    href?: undefined;
};

export type NavItem = NavLeafItem | NavGroupItem;
