import { Form, Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import ConfirmDeleteDialog from '@/components/confirm-delete-dialog';
import { formPageSurfaceClassName } from '@/components/form-page-layout';
import InputError from '@/components/input-error';
import { ListPageFilterActions } from '@/components/list-page-filter-actions';
import { ListPageFilters } from '@/components/list-page-filters';
import ListPagination from '@/components/system/list-pagination';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SystemLayout from '@/layouts/settings/system-layout';
import { cn } from '@/lib/utils';
import { index as systemHome } from '@/routes/settings/system';
import type { BreadcrumbItem, PaginatedCollection } from '@/types';

type Setting = { id: number; key: string; label: string; value: string | null; is_enabled: boolean };

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'System Setting', href: '/settings/system' },
    { title: 'System Settings', href: '/settings/system/system-settings' },
];

export default function SystemSettingsIndex({
    settings, editingSetting, formMode, filters, canCreateSystemSetting, canUpdateSystemSetting, canDeleteSystemSetting,
}: {
    settings: PaginatedCollection<Setting>; editingSetting?: Setting; formMode?: 'create' | 'edit'; filters?: { search?: string };
    canCreateSystemSetting: boolean; canUpdateSystemSetting: boolean; canDeleteSystemSetting: boolean;
}) {
    const isEdit = formMode === 'edit' && editingSetting;
    const isFormPage = formMode === 'create' || formMode === 'edit';
    const action = isEdit ? `/settings/system/system-settings/${editingSetting.id}` : '/settings/system/system-settings';
    const [search, setSearch] = useState(filters?.search ?? '');
    const [selectedDeleteSetting, setSelectedDeleteSetting] = useState<Setting | null>(null);
    const [deletingSettingId, setDeletingSettingId] = useState<number | null>(null);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- sync applied server filters into local draft after Inertia navigation
        setSearch(filters?.search ?? '');
    }, [filters?.search]);

    const applyFilters = () => {
        router.get(
            '/settings/system/system-settings',
            { search, page: 1 },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const resetFilters = () => {
        setSearch('');
        router.get(
            '/settings/system/system-settings',
            {},
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const goToPage = (page: number) => {
        router.get('/settings/system/system-settings', { search: filters?.search ?? '', page }, { preserveState: true, preserveScroll: true, replace: true });
    };

    const confirmDeleteSetting = () => {
        if (!selectedDeleteSetting || !canDeleteSystemSetting || deletingSettingId !== null) {
            return;
        }

        setDeletingSettingId(selectedDeleteSetting.id);
        router.delete(`/settings/system/system-settings/${selectedDeleteSetting.id}`, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setSelectedDeleteSetting(null);
            },
            onFinish: () => {
                setDeletingSettingId(null);
            },
        });
    };

    return (
        <SystemLayout pageTitle="System Setting - System Settings" breadcrumbs={breadcrumbs}>
            <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-semibold">System Settings</h2>
                        <p className="text-sm text-muted-foreground">
                            Manage configurable key-value settings for the application.
                        </p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href={systemHome()}>Back to system setting</Link>
                    </Button>
                </div>
                {!isFormPage && (
                    <ListPageFilters>
                        <div className="grid w-full gap-4 md:grid-cols-[1fr_auto] md:items-end">
                            <div className="grid min-w-0 gap-2">
                                <Label htmlFor="system-setting-search">Search</Label>
                                <Input
                                    id="system-setting-search"
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder="Search key or label"
                                />
                            </div>
                            <div className="flex flex-wrap items-end gap-2">
                                <ListPageFilterActions
                                    onApply={applyFilters}
                                    onReset={resetFilters}
                                />
                                {canCreateSystemSetting && (
                                    <Button asChild className="shrink-0">
                                        <Link href="/settings/system/system-settings/create">
                                            Add setting
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        </div>
                    </ListPageFilters>
                )}
                {isFormPage && (canCreateSystemSetting || canUpdateSystemSetting) && (
                    <Form
                        action={action}
                        method={isEdit ? 'put' : 'post'}
                        className={cn(formPageSurfaceClassName, 'space-y-4')}
                    >
                        {({ errors, processing }) => (
                            <>
                                <div className="grid gap-2"><Label htmlFor="key">Key</Label><Input id="key" name="key" defaultValue={editingSetting?.key} /><InputError message={errors.key} /></div>
                                <div className="grid gap-2"><Label htmlFor="label">Label</Label><Input id="label" name="label" defaultValue={editingSetting?.label} /><InputError message={errors.label} /></div>
                                <div className="grid gap-2"><Label htmlFor="value">Value</Label><Input id="value" name="value" defaultValue={editingSetting?.value ?? ''} /><InputError message={errors.value} /></div>
                                <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="is_enabled" value="1" defaultChecked={editingSetting?.is_enabled ?? true} /> Enabled</label>
                                <div className="flex gap-2">
                                    <Button disabled={processing}>{isEdit ? 'Update' : 'Create'}</Button>
                                    <Button variant="outline" asChild>
                                        <Link href="/settings/system/system-settings">Back</Link>
                                    </Button>
                                </div>
                            </>
                        )}
                    </Form>
                )}
                {!isFormPage && (
                    <div className="overflow-x-auto rounded-lg border">
                        <table className="w-full min-w-[850px] text-left text-sm">
                            <thead className="bg-muted/30">
                                <tr>
                                    <th className="px-4 py-3">Label</th>
                                    <th className="px-4 py-3">Key</th>
                                    <th className="px-4 py-3">Value</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {settings.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                                            No settings found.
                                        </td>
                                    </tr>
                                ) : (
                                    settings.data.map((setting) => (
                                        <tr key={setting.id} className="border-t">
                                            <td className="px-4 py-3 font-medium">{setting.label}</td>
                                            <td className="px-4 py-3 text-muted-foreground">{setting.key}</td>
                                            <td className="px-4 py-3 text-muted-foreground">{setting.value || '-'}</td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${setting.is_enabled ? 'bg-green-500/15 text-green-600' : 'bg-muted text-muted-foreground'}`}>
                                                    {setting.is_enabled ? 'Enabled' : 'Disabled'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex gap-2">
                                                    {canUpdateSystemSetting && <Button variant="outline" asChild><Link href={`/settings/system/system-settings/${setting.id}/edit`}>Edit</Link></Button>}
                                                    {canDeleteSystemSetting && (
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            disabled={deletingSettingId !== null}
                                                            onClick={() => setSelectedDeleteSetting(setting)}
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
                        currentPage={settings.current_page}
                        lastPage={settings.last_page}
                        from={settings.from}
                        to={settings.to}
                        total={settings.total}
                        onPageChange={goToPage}
                    />
                )}
            </div>
            <ConfirmDeleteDialog
                open={selectedDeleteSetting !== null}
                title="Delete setting"
                description={
                    selectedDeleteSetting
                        ? `Are you sure you want to delete ${selectedDeleteSetting.label}? This action cannot be undone.`
                        : ''
                }
                confirmLabel="Delete setting"
                processing={deletingSettingId !== null}
                onOpenChange={(open) => !open && deletingSettingId === null && setSelectedDeleteSetting(null)}
                onCancel={() => setSelectedDeleteSetting(null)}
                onConfirm={confirmDeleteSetting}
            />
        </SystemLayout>
    );
}
