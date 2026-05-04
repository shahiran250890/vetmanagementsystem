import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { defaultSettingsNav } from '@/config/settings-nav';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn, toUrl } from '@/lib/utils';
import type { NavItem } from '@/types';

type SettingsLayoutProps = PropsWithChildren<{
    title?: string;
    description?: string;
    navItems?: NavItem[];
    contentClassName?: string;
}>;

export default function SettingsLayout({
    children,
    title = 'Settings',
    description = 'Manage your profile and account settings',
    navItems = defaultSettingsNav,
    contentClassName,
}: SettingsLayoutProps) {
    const { isCurrentOrParentUrl } = useCurrentUrl();

    return (
        <div className="w-full min-w-0">
            <Heading
                title={title}
                description={description}
            />

            <div className="flex flex-col lg:flex-row lg:space-x-12">
                <aside className="w-full max-w-xl lg:w-48">
                    <nav
                        className="flex flex-col space-y-1 space-x-0"
                        aria-label="Settings"
                    >
                        {navItems.map((item, index) => (
                            <Button
                                key={`${toUrl(item.href)}-${index}`}
                                size="sm"
                                variant="ghost"
                                asChild
                                className={cn('w-full justify-start', {
                                    'bg-muted': isCurrentOrParentUrl(item.href),
                                })}
                            >
                                <Link href={item.href}>
                                    {item.icon && (
                                        <item.icon className="h-4 w-4" />
                                    )}
                                    {item.title}
                                </Link>
                            </Button>
                        ))}
                    </nav>
                </aside>

                <Separator className="my-6 lg:hidden" />

                <div className="flex-1">
                    <section className={cn('max-w-xl space-y-12', contentClassName)}>
                        {children}
                    </section>
                </div>
            </div>
        </div>
    );
}
