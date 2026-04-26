import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import SystemLayout from '@/layouts/settings/system-layout';
import type { BreadcrumbItem } from '@/types';

type Role = { id: number; name: string };
type ManagedUser = {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    is_enabled: boolean;
    roles: Role[];
};

export default function UsersShow({
    managedUser,
    canUpdateUser,
}: {
    managedUser: ManagedUser;
    canUpdateUser: boolean;
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'System Setting', href: '/settings/system' },
        { title: 'User Management', href: '/settings/system/users' },
        { title: managedUser.name, href: `/settings/system/users/${managedUser.id}` },
    ];

    return (
        <SystemLayout pageTitle={`System Setting - ${managedUser.name}`} breadcrumbs={breadcrumbs}>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">{managedUser.name}</h1>
                    <div className="flex gap-2">
                        {canUpdateUser && (
                            <Button variant="outline" asChild>
                                <Link href={`/settings/system/users/${managedUser.id}/edit`}>Edit</Link>
                            </Button>
                        )}
                        <Button variant="outline" asChild>
                            <Link href="/settings/system/users">Back</Link>
                        </Button>
                    </div>
                </div>

                <section className="grid gap-4 rounded-lg border p-4 md:grid-cols-2">
                    <div>
                        <p className="text-sm text-muted-foreground">Name</p>
                        <p className="font-medium">{managedUser.name}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p>{managedUser.email}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p>{managedUser.phone ?? '-'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <p>{managedUser.is_enabled ? 'Enabled' : 'Disabled'}</p>
                    </div>
                </section>

                <section className="space-y-3 rounded-lg border p-4">
                    <h2 className="text-lg font-medium">Roles</h2>
                    {managedUser.roles.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No roles assigned.</p>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {managedUser.roles.map((role) => (
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
