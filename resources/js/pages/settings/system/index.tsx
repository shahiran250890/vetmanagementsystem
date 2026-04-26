import { Link, usePage } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';
import { Building2, KeyRound, ShieldCheck, SlidersHorizontal, UserCog, UsersRound } from 'lucide-react';
import SystemLayout from '@/layouts/settings/system-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [{ title: 'System Setting', href: '/settings/system' }];

const systemLinks = [
    { title: 'User Management', href: '/settings/system/users', description: 'Manage user accounts and role assignments.', icon: UsersRound },
    { title: 'Role Management', href: '/settings/system/roles', description: 'Manage system roles and permission bundles.', icon: UserCog },
    { title: 'Permission Management', href: '/settings/system/permissions', description: 'Manage available permission keys.', icon: ShieldCheck },
    { title: 'Species Management', href: '/settings/system/species', description: 'Manage available patient species.', icon: KeyRound },
    { title: 'System Settings', href: '/settings/system/system-settings', description: 'Manage key-value system settings.', icon: SlidersHorizontal },
    { title: 'Organization Profile', href: '/settings/system/organization', description: 'Manage organization and clinic details.', icon: Building2 },
] as const satisfies Array<{ title: string; href: string; description: string; icon: LucideIcon }>;

export default function SystemSettingIndex() {
    const {
        organizationClinicType,
    } = usePage().props as { organizationClinicType?: 'vet' | 'human' | null };
    const filteredSystemLinks = organizationClinicType === 'human'
        ? systemLinks.filter((item) => item.href !== '/settings/system/species')
        : systemLinks;

    return (
        <SystemLayout pageTitle="System Setting" breadcrumbs={breadcrumbs}>
                <div className="space-y-4">
                    <div>
                        <h2 className="text-lg font-semibold">System Setting</h2>
                        <p className="text-sm text-muted-foreground">Choose a management module.</p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                        {filteredSystemLinks.map((item) => (
                            <Link key={item.href} href={item.href} className="group rounded-lg border p-4 transition hover:border-primary/40 hover:bg-muted/40">
                                <div className="mb-3 flex items-center gap-2">
                                    <item.icon className="h-4 w-4 text-muted-foreground transition group-hover:text-primary" />
                                    <p className="font-medium">{item.title}</p>
                                </div>
                                <p className="text-sm text-muted-foreground">{item.description}</p>
                            </Link>
                        ))}
                    </div>
                </div>
        </SystemLayout>
    );
}
