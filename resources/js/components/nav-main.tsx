import { Link } from '@inertiajs/react';
import { useMemo } from 'react';

import { Badge } from '@/components/ui/badge';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { useToast } from '@/contexts/toast-context';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn, toUrl } from '@/lib/utils';
import type { NavLeafItem } from '@/types';

type NavGroup = { label: string; items: NavLeafItem[] };

function buildGroups(items: NavLeafItem[]): NavGroup[] {
    const order: string[] = [];
    const map = new Map<string, NavLeafItem[]>();

    for (const item of items) {
        const label = item.group ?? 'Workspace';

        if (!map.has(label)) {
            order.push(label);
            map.set(label, []);
        }

        map.get(label)!.push(item);
    }

    return order.map((label) => ({ label, items: map.get(label)! }));
}

function LeafNavItem({ item }: { item: NavLeafItem }) {
    const { isCurrentUrl, isCurrentOrParentUrl } = useCurrentUrl();
    const { push } = useToast();
    const { setOpenMobile, isMobile } = useSidebar();

    const closeMobileDrawer = () => {
        if (isMobile) {
            setOpenMobile(false);
        }
    };

    const href = item.href ? toUrl(item.href) : '';
    const isPlaceholder = href === '#' || item.comingSoon;
    const Icon = item.icon ?? null;

    const routeActive =
        item.activeWhenPrefix != null && item.activeWhenPrefix !== ''
            ? isCurrentOrParentUrl(item.activeWhenPrefix)
            : item.href
              ? isCurrentUrl(item.href)
              : false;

    if (isPlaceholder) {
        return (
            <SidebarMenuItem>
                <SidebarMenuButton
                    type="button"
                    className="min-h-11 py-2"
                    tooltip={{
                        children:
                            'This module is under development. Check back for updates.',
                    }}
                    onClick={() => {
                        push('This module is under development.', 'success');
                        closeMobileDrawer();
                    }}
                >
                    {Icon ? <Icon /> : null}
                    <span className="flex min-w-0 flex-1 items-center gap-2">
                        <span className="truncate">{item.title}</span>
                        {item.comingSoon ? (
                            <Badge variant="secondary" className="shrink-0 px-1.5 py-0 text-[10px] font-normal">
                                Soon
                            </Badge>
                        ) : null}
                    </span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        );
    }

    return (
        <SidebarMenuItem>
            <SidebarMenuButton
                asChild
                isActive={
                    item.externalDocument
                        ? false
                        : routeActive
                }
                tooltip={{ children: item.title }}
                className="min-h-11 py-2"
            >
                {item.externalDocument ? (
                    <a href={href}>
                        {Icon ? <Icon /> : null}
                        <span className="truncate">{item.title}</span>
                    </a>
                ) : (
                    <Link href={item.href!} prefetch onClick={closeMobileDrawer}>
                        {Icon ? <Icon /> : null}
                        <span className="truncate">{item.title}</span>
                    </Link>
                )}
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
}

export function NavMain({ items = [] }: { items: NavLeafItem[] }) {
    const groups = useMemo(() => buildGroups(items), [items]);

    return (
        <>
            {groups.map((group) => (
                <SidebarGroup
                    key={group.label}
                    className={cn(
                        'px-2 py-0',
                        'transition-opacity duration-200 ease-in-out',
                    )}
                >
                    <SidebarGroupLabel className="truncate">{group.label}</SidebarGroupLabel>
                    <SidebarMenu className="gap-0.5">
                        {group.items.map((item) => (
                            <LeafNavItem key={item.title} item={item} />
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            ))}
        </>
    );
}
