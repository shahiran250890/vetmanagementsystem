import type { InertiaLinkProps } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';

export type BreadcrumbItem = {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
};

export type NavItem = {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    /** Groups items under a sidebar section label. */
    group?: string;
    /** When set, the user must have at least one of these roles. */
    roles?: string[];
    /** When set, the user must have at least one of these permissions. */
    permissions?: string[];
    isActive?: boolean;
    /**
     * When true, render a plain anchor so the browser performs a full document load.
     */
    externalDocument?: boolean;
};
