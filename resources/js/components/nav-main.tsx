import { Link } from '@inertiajs/react';
import { useMemo } from 'react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn, toUrl } from '@/lib/utils';
import type { NavItem } from '@/types';

type NavGroup = { label: string; items: NavItem[] };

function buildGroups(items: NavItem[]): NavGroup[] {
    const order: string[] = [];
    const map = new Map<string, NavItem[]>();

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

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const { isCurrentUrl } = useCurrentUrl();

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
                    <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
                    <SidebarMenu>
                        {group.items.map((item) => (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={
                                        item.externalDocument
                                            ? false
                                            : isCurrentUrl(item.href)
                                    }
                                    tooltip={{ children: item.title }}
                                >
                                    {item.externalDocument ? (
                                        <a href={toUrl(item.href)}>
                                            {item.icon && <item.icon />}
                                            <span>{item.title}</span>
                                        </a>
                                    ) : (
                                        <Link href={item.href} prefetch>
                                            {item.icon && <item.icon />}
                                            <span>{item.title}</span>
                                        </Link>
                                    )}
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            ))}
        </>
    );
}
