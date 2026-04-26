import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import SystemLayout from '@/layouts/settings/system-layout';
import type { BreadcrumbItem } from '@/types';

type Permission = { id: number; name: string };
type Role = { id: number; name: string; permissions: Permission[] };

export default function RolesShow({
    role,
    canUpdateRole,
}: {
    role: Role;
    canUpdateRole: boolean;
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'System Setting', href: '/settings/system' },
        { title: 'Role Management', href: '/settings/system/roles' },
        { title: role.name, href: `/settings/system/roles/${role.id}` },
    ];

    return (
        <SystemLayout pageTitle={`System Setting - ${role.name}`} breadcrumbs={breadcrumbs}>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">{role.name}</h1>
                    <div className="flex gap-2">
                        {canUpdateRole && (
                            <Button variant="outline" asChild>
                                <Link href={`/settings/system/roles/${role.id}/edit`}>Edit</Link>
                            </Button>
                        )}
                        <Button variant="outline" asChild>
                            <Link href="/settings/system/roles">Back</Link>
                        </Button>
                    </div>
                </div>

                <section className="space-y-3 rounded-lg border p-4">
                    <h2 className="text-lg font-medium">Permissions</h2>
                    {role.permissions.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No permissions assigned.</p>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {role.permissions.map((permission) => (
                                <span key={permission.id} className="rounded-full bg-muted px-3 py-1 text-sm">
                                    {permission.name}
                                </span>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </SystemLayout>
    );
}
