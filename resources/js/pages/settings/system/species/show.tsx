import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import SystemLayout from '@/layouts/settings/system-layout';
import type { BreadcrumbItem } from '@/types';

type Breed = {
    id: number;
    name: string;
    code: string;
    is_enabled: boolean;
};

type Species = {
    id: number;
    name: string;
    code: string;
    is_enabled: boolean;
    breeds: Breed[];
};

export default function SpeciesShow({ species }: { species: Species }) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'System Setting', href: '/settings/system' },
        { title: 'Species Management', href: '/settings/system/species' },
        { title: species.name, href: `/settings/system/species/${species.id}` },
    ];

    return (
        <SystemLayout pageTitle={`System Setting - ${species.name}`} breadcrumbs={breadcrumbs}>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">{species.name}</h1>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={`/settings/system/species/${species.id}/edit`}>Edit</Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/settings/system/species">Back</Link>
                        </Button>
                    </div>
                </div>

                <section className="grid gap-4 rounded-lg border p-4 md:grid-cols-2">
                    <div>
                        <p className="text-sm text-muted-foreground">Name</p>
                        <p className="font-medium">{species.name}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Code</p>
                        <p className="font-medium">{species.code}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <p>{species.is_enabled ? 'Enabled' : 'Disabled'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Total breeds</p>
                        <p>{species.breeds.length}</p>
                    </div>
                </section>

                <section className="space-y-3 rounded-lg border p-4">
                    <h2 className="text-lg font-medium">Breeds</h2>
                    {species.breeds.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No breeds available for this species.</p>
                    ) : (
                        <div className="overflow-x-auto rounded border">
                            <table className="w-full min-w-[620px] text-left text-sm">
                                <thead className="bg-muted/30">
                                    <tr>
                                        <th className="px-4 py-3">Name</th>
                                        <th className="px-4 py-3">Code</th>
                                        <th className="px-4 py-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {species.breeds.map((breed) => (
                                        <tr key={breed.id} className="border-t">
                                            <td className="px-4 py-3 font-medium">{breed.name}</td>
                                            <td className="px-4 py-3 text-muted-foreground">{breed.code}</td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                                                        breed.is_enabled
                                                            ? 'bg-green-500/15 text-green-600'
                                                            : 'bg-muted text-muted-foreground'
                                                    }`}
                                                >
                                                    {breed.is_enabled ? 'Enabled' : 'Disabled'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </div>
        </SystemLayout>
    );
}
