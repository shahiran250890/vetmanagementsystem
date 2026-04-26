import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import SystemLayout from '@/layouts/settings/system-layout';
import type { BreadcrumbItem } from '@/types';

type Role = { id: number; name: string };
type Permission = { id: number; name: string; roles: Role[] };

export default function PermissionsShow({
    permission,
    canUpdatePermission,
}: {
    permission: Permission;
    canUpdatePermission: boolean;
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'System Setting', href: '/settings/system' },
        { title: 'Permission Management', href: '/settings/system/permissions' },
        { title: permission.name, href: `/settings/system/permissions/${permission.id}` },
    ];

    return (
        <SystemLayout pageTitle={`System Setting - ${permission.name}`} breadcrumbs={breadcrumbs}>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">{permission.name}</h1>
                    <div className="flex gap-2">
                        {canUpdatePermission && (
                            <Button variant="outline" asChild>
                                <Link href={`/settings/system/permissions/${permission.id}/edit`}>Edit</Link>
                            </Button>
                        )}
                        <Button variant="outline" asChild>
                            <Link href="/settings/system/permissions">Back</Link>
                        </Button>
                    </div>
                </div>

                <section className="space-y-3 rounded-lg border p-4">
                    <h2 className="text-lg font-medium">Assigned Roles</h2>
                    {permission.roles.length === 0 ? (
                        <p className="text-sm text-muted-foreground">This permission is not assigned to any role.</p>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {permission.roles.map((role) => (
                                <span key={role.id} className="rounded-full bg-muted px-3 py-1 text-sm">
                                    {role.name}
                                </span>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </SystemLayout>
    );
}
