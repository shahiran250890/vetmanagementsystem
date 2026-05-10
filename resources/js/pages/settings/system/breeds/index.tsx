import { Form, Link, router } from '@inertiajs/react';
import { FormDropdown } from '@/components/form-dropdown';
import { formPageSurfaceClassName } from '@/components/form-page-layout';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SystemLayout from '@/layouts/settings/system-layout';
import { cn } from '@/lib/utils';
import type { BreadcrumbItem } from '@/types';

type Breed = { id: number; species_id: number; name: string; code: string; is_enabled: boolean; species?: { id: number; name: string } };
type SpeciesOption = { id: number; name: string };
const breadcrumbs: BreadcrumbItem[] = [
    { title: 'System Setting', href: '/settings/system' },
    { title: 'Breed Management', href: '/settings/system/breeds' },
];

export default function BreedsIndex({ breeds, speciesOptions, editingBreed, formMode = 'create', canCreateBreed, canUpdateBreed, canDeleteBreed }: { breeds: Breed[]; speciesOptions: SpeciesOption[]; editingBreed?: Breed; formMode?: 'create'|'edit'; canCreateBreed: boolean; canUpdateBreed: boolean; canDeleteBreed: boolean }) {
    const isEdit = formMode === 'edit' && editingBreed;
    const action = isEdit ? `/settings/system/breeds/${editingBreed.id}` : '/settings/system/breeds';

    return (
        <SystemLayout pageTitle="System Setting - Breed Management" breadcrumbs={breadcrumbs} contentClassName="max-w-xl">
                <div className="space-y-4">
                    {(canCreateBreed || canUpdateBreed) && (
                        <Form
                            action={action}
                            method={isEdit ? 'put' : 'post'}
                            className={cn(formPageSurfaceClassName, 'space-y-4')}
                        >
                            {({ errors, processing }) => (
                                <>
                                    <div className="grid gap-2">
                                        <FormDropdown
                                            id="species_id"
                                            name="species_id"
                                            label="Species"
                                            options={speciesOptions.map((option) => ({
                                                value: String(option.id),
                                                label: option.name,
                                            }))}
                                            defaultValue={
                                                editingBreed?.species_id !== undefined
                                                    ? String(editingBreed.species_id)
                                                    : ''
                                            }
                                            allowEmpty
                                            emptyOptionLabel="Select species"
                                            placeholder="Select species"
                                            error={errors.species_id}
                                            resetKey={editingBreed?.id ?? 'create'}
                                        />
                                    </div>
                                    <div className="grid gap-2"><Label htmlFor="name">Name</Label><Input id="name" name="name" defaultValue={editingBreed?.name} /><InputError message={errors.name} /></div>
                                    <div className="grid gap-2"><Label htmlFor="code">Code</Label><Input id="code" name="code" defaultValue={editingBreed?.code} /><InputError message={errors.code} /></div>
                                    <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="is_enabled" value="1" defaultChecked={editingBreed?.is_enabled ?? true} /> Enabled</label>
                                    <Button disabled={processing}>{isEdit ? 'Update' : 'Create'} breed</Button>
                                </>
                            )}
                        </Form>
                    )}
                    {breeds.map((breed) => (
                        <div key={breed.id} className="flex items-center justify-between rounded border p-3">
                            <div><p className="font-medium">{breed.name} ({breed.code})</p><p className="text-sm text-muted-foreground">{breed.species?.name ?? '-'}</p></div>
                            <div className="flex gap-2">
                                {canUpdateBreed && <Button variant="outline" asChild><Link href={`/settings/system/breeds/${breed.id}/edit`}>Edit</Link></Button>}
                                {canDeleteBreed && <Button variant="destructive" onClick={() => router.delete(`/settings/system/breeds/${breed.id}`)}>Delete</Button>}
                            </div>
                        </div>
                    ))}
                </div>
        </SystemLayout>
    );
}
