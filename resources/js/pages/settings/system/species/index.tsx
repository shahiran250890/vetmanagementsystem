import { Form, Head, Link, router } from '@inertiajs/react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import type { BreadcrumbItem } from '@/types';

type Species = { id: number; name: string; code: string; is_enabled: boolean; breeds_count: number };
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'System Setting', href: '/settings/system' },
    { title: 'Species Management', href: '/settings/system/species' },
];

export default function SpeciesIndex({ species, editingSpecies, formMode = 'create', canCreateSpecies, canUpdateSpecies, canDeleteSpecies }: { species: Species[]; editingSpecies?: Species; formMode?: 'create'|'edit'; canCreateSpecies: boolean; canUpdateSpecies: boolean; canDeleteSpecies: boolean }) {
    const isEdit = formMode === 'edit' && editingSpecies;
    const action = isEdit ? `/settings/system/species/${editingSpecies.id}` : '/settings/system/species';
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="System Setting - Species Management" />
            <SettingsLayout>
                <div className="space-y-4">
                    {(canCreateSpecies || canUpdateSpecies) && (
                        <Form action={action} method={isEdit ? 'put' : 'post'} className="space-y-4 rounded border p-4">
                            {({ errors, processing }) => (
                                <>
                                    <div className="grid gap-2"><Label htmlFor="name">Name</Label><Input id="name" name="name" defaultValue={editingSpecies?.name} /><InputError message={errors.name} /></div>
                                    <div className="grid gap-2"><Label htmlFor="code">Code</Label><Input id="code" name="code" defaultValue={editingSpecies?.code} /><InputError message={errors.code} /></div>
                                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="is_enabled" value="1" defaultChecked={editingSpecies?.is_enabled ?? true} /> Enabled</label>
                                    <Button disabled={processing}>{isEdit ? 'Update' : 'Create'} species</Button>
                                </>
                            )}
                        </Form>
                    )}
                    {species.map((item) => (
                        <div key={item.id} className="flex items-center justify-between rounded border p-3">
                            <div><p className="font-medium">{item.name} ({item.code})</p><p className="text-sm text-muted-foreground">{item.breeds_count} breeds</p></div>
                            <div className="flex gap-2">
                                {canUpdateSpecies && <Button variant="outline" asChild><Link href={`/settings/system/species/${item.id}/edit`}>Edit</Link></Button>}
                                {canDeleteSpecies && <Button variant="destructive" onClick={() => router.delete(`/settings/system/species/${item.id}`)}>Delete</Button>}
                            </div>
                        </div>
                    ))}
                </div>
            </SettingsLayout>
        </AppLayout>
    );
}
