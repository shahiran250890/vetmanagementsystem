import { Link, usePage } from '@inertiajs/react';
import { useMemo } from 'react';

import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { filterNavItemsByAuth, getMainNavItems } from '@/config/main-nav';
import { useAuthRoles } from '@/hooks/use-auth-roles';
import { dashboard } from '@/routes';

export function AppSidebar() {
    const { roles, permissions } = useAuthRoles();
    const { organizationClinicType } = usePage().props as {
        organizationClinicType?: 'vet' | 'human' | null;
    };

    const visibleMainNav = useMemo(
        () =>
            filterNavItemsByAuth(
                getMainNavItems(),
                roles,
                permissions,
                organizationClinicType ?? null,
            ),
        [roles, permissions, organizationClinicType],
    );

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="min-h-11">
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="overflow-x-hidden">
                <NavMain items={visibleMainNav} />
            </SidebarContent>
        </Sidebar>
    );
}
