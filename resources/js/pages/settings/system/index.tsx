import { Link, usePage } from '@inertiajs/react';
import { useMemo } from 'react';

import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { isSystemSettingHubModuleVisible } from '@/config/main-nav';
import {
    getSystemSettingModules,
    SYSTEM_SETTING_HUB_PATH,
} from '@/config/system-setting-hub';
import type { SystemSettingModuleCard } from '@/config/system-setting-hub';
import { useToast } from '@/contexts/toast-context';
import { useAuthRoles } from '@/hooks/use-auth-roles';
import SystemLayout from '@/layouts/settings/system-layout';
import { cn } from '@/lib/utils';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'System Setting', href: SYSTEM_SETTING_HUB_PATH }];

const cardSurfaceClassName =
    'group flex min-h-[44px] w-full rounded-lg border p-4 text-left transition hover:border-primary/40 hover:bg-muted/40';

function ModuleCard({
    module,
    onPlaceholderNavigate,
}: {
    module: SystemSettingModuleCard;
    onPlaceholderNavigate: () => void;
}) {
    const Icon = module.icon;
    const isPlaceholder = module.href === '#';

    if (isPlaceholder) {
        return (
            <button type="button" onClick={onPlaceholderNavigate} className={cn(cardSurfaceClassName)}>
                <div className="flex w-full min-w-0 flex-col gap-2">
                    <div className="flex items-start gap-2">
                        <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground transition group-hover:text-primary" />
                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <p className="font-medium">{module.title}</p>
                                {module.comingSoon ? (
                                    <Badge variant="secondary" className="shrink-0 px-1.5 py-0 text-[10px] font-normal">
                                        Coming soon
                                    </Badge>
                                ) : null}
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">{module.description}</p>
                        </div>
                    </div>
                </div>
            </button>
        );
    }

    return (
        <Link href={module.href} prefetch className={cn(cardSurfaceClassName)}>
            <div className="flex w-full min-w-0 flex-col gap-2">
                <div className="flex items-start gap-2">
                    <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground transition group-hover:text-primary" />
                    <div className="min-w-0 flex-1">
                        <p className="font-medium">{module.title}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{module.description}</p>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default function SystemSettingIndex() {
    const { organizationClinicType } = usePage().props as {
        organizationClinicType?: 'vet' | 'human' | null;
    };
    const { roles, permissions } = useAuthRoles();
    const { push } = useToast();

    const visibleModules = useMemo(() => {
        return getSystemSettingModules(organizationClinicType ?? null).filter((m) =>
            isSystemSettingHubModuleVisible(m, roles, permissions),
        );
    }, [organizationClinicType, roles, permissions]);

    const configuredModules = useMemo(
        () => visibleModules.filter((m) => m.href !== '#'),
        [visibleModules],
    );

    const roadmapModules = useMemo(
        () => visibleModules.filter((m) => m.href === '#'),
        [visibleModules],
    );

    const notifyPlaceholder = () => {
        push('This module is under development.', 'success');
    };

    return (
        <SystemLayout pageTitle="System Setting" breadcrumbs={breadcrumbs}>
            <div className="space-y-6 overflow-x-hidden">
                <div>
                    <h2 className="text-lg font-semibold">System Setting</h2>
                    <p className="text-sm text-muted-foreground">
                        Browse and open configuration modules. Placeholders show what is planned next.
                    </p>
                </div>

                {configuredModules.length > 0 ? (
                    <section className="space-y-3">
                        <h3 className="text-sm font-medium text-muted-foreground">Configuration modules</h3>
                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                            {configuredModules.map((module) => (
                                <ModuleCard
                                    key={`${module.title}-${module.href}`}
                                    module={module}
                                    onPlaceholderNavigate={notifyPlaceholder}
                                />
                            ))}
                        </div>
                    </section>
                ) : null}

                {configuredModules.length > 0 && roadmapModules.length > 0 ? (
                    <Separator className="my-2" />
                ) : null}

                {roadmapModules.length > 0 ? (
                    <section className="space-y-3">
                        <h3 className="text-sm font-medium text-muted-foreground">Roadmap</h3>
                        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                            {roadmapModules.map((module) => (
                                <ModuleCard
                                    key={`${module.title}-${module.href}`}
                                    module={module}
                                    onPlaceholderNavigate={notifyPlaceholder}
                                />
                            ))}
                        </div>
                    </section>
                ) : null}
            </div>
        </SystemLayout>
    );
}
