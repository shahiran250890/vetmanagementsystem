import { Link } from '@inertiajs/react';
import { useMemo } from 'react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { isNavItemVisible, mainNav } from '@/config/main-nav';
import { useAuthRoles } from '@/hooks/use-auth-roles';
import { dashboard } from '@/routes';
export function AppSidebar() {
    const { roles, permissions } = useAuthRoles();

    const visibleMainNav = useMemo(
        () =>
            mainNav.filter((item) =>
                isNavItemVisible(item, roles, permissions),
            ),
        [roles, permissions],
    );

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={visibleMainNav} />
            </SidebarContent>
        </Sidebar>
    );
}
