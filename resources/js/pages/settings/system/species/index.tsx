import { Form, Link, router } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import ConfirmDeleteDialog from '@/components/confirm-delete-dialog';
import InputError from '@/components/input-error';
import ListPagination from '@/components/system/list-pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SystemLayout from '@/layouts/settings/system-layout';
import type { BreadcrumbItem, PaginatedCollection } from '@/types';

type BreedFormItem = {
    id?: number;
    name: string;
    code: string;
    is_enabled: boolean;
};

type Species = {
    id: number;
    name: string;
    code: string;
    is_enabled: boolean;
    breeds_count: number;
    breeds?: BreedFormItem[];
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'System Setting', href: '/settings/system' },
    { title: 'Species Management', href: '/settings/system/species' },
];

export default function SpeciesIndex({
    species,
    editingSpecies,
    formMode,
    filters,
    canCreateSpecies,
    canUpdateSpecies,
    canDeleteSpecies,
}: {
    species: PaginatedCollection<Species>;
    editingSpecies?: Species;
    formMode?: 'create'|'edit';
    filters?: { search?: string };
    canCreateSpecies: boolean;
    canUpdateSpecies: boolean;
    canDeleteSpecies: boolean;
}) {
    const isEdit = formMode === 'edit' && editingSpecies;
    const isFormPage = formMode === 'create' || formMode === 'edit';
    const action = isEdit ? `/settings/system/species/${editingSpecies.id}` : '/settings/system/species';
    const [search, setSearch] = useState(filters?.search ?? '');
    const [debouncedSearch, setDebouncedSearch] = useState(filters?.search ?? '');
    const [selectedDeleteSpecies, setSelectedDeleteSpecies] = useState<Species | null>(null);
    const [deletingSpeciesId, setDeletingSpeciesId] = useState<number | null>(null);
    const [breedRows, setBreedRows] = useState<BreedFormItem[]>([]);

    const initialBreedRows = useMemo(
        () => (editingSpecies?.breeds ?? []).map((breed) => ({
            id: breed.id,
            name: breed.name ?? '',
            code: breed.code ?? '',
            is_enabled: breed.is_enabled ?? true,
        })),
        [editingSpecies?.breeds],
    );

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedSearch(search);
        }, 300);

        return () => clearTimeout(timeout);
    }, [search]);

    useEffect(() => {
        if (isFormPage || debouncedSearch === (filters?.search ?? '')) {
            return;
        }

        router.get('/settings/system/species', { search: debouncedSearch, page: 1 }, { preserveState: true, preserveScroll: true, replace: true });
    }, [debouncedSearch, filters?.search, isFormPage]);

    useEffect(() => {
        if (!isFormPage) {
            return;
        }

        setBreedRows(initialBreedRows);
    }, [initialBreedRows, isFormPage]);

    const goToPage = (page: number) => {
        router.get('/settings/system/species', { search: filters?.search ?? '', page }, { preserveState: true, preserveScroll: true, replace: true });
    };

    const addBreedRow = () => {
        setBreedRows((currentRows) => [...currentRows, { name: '', code: '', is_enabled: true }]);
    };

    const removeBreedRow = (index: number) => {
        setBreedRows((currentRows) => currentRows.filter((_, rowIndex) => rowIndex !== index));
    };

    const updateBreedRow = <K extends keyof BreedFormItem>(index: number, key: K, value: BreedFormItem[K]) => {
        setBreedRows((currentRows) =>
            currentRows.map((row, rowIndex) => (rowIndex === index ? { ...row, [key]: value } : row)),
        );
    };

    const confirmDeleteSpecies = () => {
        if (!selectedDeleteSpecies || !canDeleteSpecies || deletingSpeciesId !== null) {
            return;
        }

        setDeletingSpeciesId(selectedDeleteSpecies.id);
        router.delete(`/settings/system/species/${selectedDeleteSpecies.id}`, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setSelectedDeleteSpecies(null);
            },
            onFinish: () => {
                setDeletingSpeciesId(null);
            },
        });
    };

    return (
        <SystemLayout pageTitle="System Setting - Species Management" breadcrumbs={breadcrumbs}>
            <div className="space-y-4">
                {!isFormPage && (
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex flex-1 items-center gap-2">
                            <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search species name" />
                        </div>
                        {canCreateSpecies && (
                            <Button asChild>
                                <Link href="/settings/system/species/create">Add species</Link>
                            </Button>
                        )}
                    </div>
                )}
                {isFormPage && (canCreateSpecies || canUpdateSpecies) && (
                    <Form action={action} method={isEdit ? 'put' : 'post'} className="space-y-4 rounded border p-4">
                        {({ errors, processing }) => (
                            <>
                                <div className="grid gap-2"><Label htmlFor="name">Name</Label><Input id="name" name="name" defaultValue={editingSpecies?.name} /><InputError message={errors.name} /></div>
                                <div className="grid gap-2"><Label htmlFor="code">Code</Label><Input id="code" name="code" defaultValue={editingSpecies?.code} /><InputError message={errors.code} /></div>
                                <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="is_enabled" value="1" defaultChecked={editingSpecies?.is_enabled ?? true} /> Enabled</label>
                                <div className="space-y-3 rounded border p-3">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-medium">Breed</h3>
                                        <Button type="button" variant="outline" onClick={addBreedRow}>Add breed</Button>
                                    </div>
                                    {breedRows.length === 0 && (
                                        <p className="text-sm text-muted-foreground">No breeds added yet.</p>
                                    )}
                                    {breedRows.map((breedRow, index) => (
                                        <div key={`breed-row-${index}`} className="space-y-3 rounded border p-3">
                                            <input type="hidden" name={`breeds[${index}][id]`} value={breedRow.id ?? ''} />
                                            <div className="grid gap-2">
                                                <Label htmlFor={`breed-name-${index}`}>Breed name</Label>
                                                <Input
                                                    id={`breed-name-${index}`}
                                                    name={`breeds[${index}][name]`}
                                                    value={breedRow.name}
                                                    onChange={(event) => updateBreedRow(index, 'name', event.target.value)}
                                                />
                                                <InputError message={errors[`breeds.${index}.name`]} />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor={`breed-code-${index}`}>Breed code</Label>
                                                <Input
                                                    id={`breed-code-${index}`}
                                                    name={`breeds[${index}][code]`}
                                                    value={breedRow.code}
                                                    onChange={(event) => updateBreedRow(index, 'code', event.target.value)}
                                                />
                                                <InputError message={errors[`breeds.${index}.code`]} />
                                            </div>
                                            <div className="flex items-center justify-between gap-2">
                                                <label className="flex items-center gap-2 text-sm">
                                                    <input type="hidden" name={`breeds[${index}][is_enabled]`} value="0" />
                                                    <input
                                                        type="checkbox"
                                                        name={`breeds[${index}][is_enabled]`}
                                                        value="1"
                                                        checked={breedRow.is_enabled}
                                                        onChange={(event) => updateBreedRow(index, 'is_enabled', event.target.checked)}
                                                    />
                                                    Enabled
                                                </label>
                                                <Button type="button" variant="destructive" onClick={() => removeBreedRow(index)}>
                                                    Remove
                                                </Button>
                                            </div>
                                            <InputError message={errors[`breeds.${index}.is_enabled`]} />
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <Button disabled={processing}>{isEdit ? 'Update' : 'Create'}</Button>
                                    <Button variant="outline" asChild>
                                        <Link href="/settings/system/species">Back</Link>
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                )}
                {!isFormPage && (
                    <div className="overflow-x-auto rounded-lg border">
                        <table className="w-full min-w-[800px] text-left text-sm">
                            <thead className="bg-muted/30">
                                <tr>
                                    <th className="px-4 py-3">Name</th>
                                    <th className="px-4 py-3">Code</th>
                                    <th className="px-4 py-3">Breeds</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {species.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                                            No species found.
                                        </td>
                                    </tr>
                                ) : (
                                    species.data.map((item) => (
                                        <tr key={item.id} className="border-t">
                                            <td className="px-4 py-3 font-medium">{item.name}</td>
                                            <td className="px-4 py-3 text-muted-foreground">{item.code}</td>
                                            <td className="px-4 py-3 text-muted-foreground">{item.breeds_count}</td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${item.is_enabled ? 'bg-green-500/15 text-green-600' : 'bg-muted text-muted-foreground'}`}>
                                                    {item.is_enabled ? 'Enabled' : 'Disabled'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex gap-2">
                                                    <Button className="bg-sky-600 text-white hover:bg-sky-700" asChild>
                                                        <Link href={`/settings/system/species/${item.id}`}>View</Link>
                                                    </Button>
                                                    {canUpdateSpecies && <Button variant="outline" asChild><Link href={`/settings/system/species/${item.id}/edit`}>Edit</Link></Button>}
                                                    {canDeleteSpecies && (
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            disabled={deletingSpeciesId !== null}
                                                            onClick={() => setSelectedDeleteSpecies(item)}
                                                        >
                                                            Delete
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
                {!isFormPage && (
                    <ListPagination
                        currentPage={species.current_page}
                        lastPage={species.last_page}
                        from={species.from}
                        to={species.to}
                        total={species.total}
                        onPageChange={goToPage}
                    />
                )}
            </div>
            <ConfirmDeleteDialog
                open={selectedDeleteSpecies !== null}
                title="Delete species"
                description={
                    selectedDeleteSpecies
                        ? `Are you sure you want to delete ${selectedDeleteSpecies.name}? This action cannot be undone.`
                        : ''
                }
                confirmLabel="Delete species"
                processing={deletingSpeciesId !== null}
                onOpenChange={(open) => !open && deletingSpeciesId === null && setSelectedDeleteSpecies(null)}
                onCancel={() => setSelectedDeleteSpecies(null)}
                onConfirm={confirmDeleteSpecies}
            />
        </SystemLayout>
    );
}
