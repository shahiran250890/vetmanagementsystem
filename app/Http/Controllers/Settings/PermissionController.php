<?php

namespace App\Http\Controllers\Settings;

use App\Concerns\HasResourcePermission;
use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\PermissionRequest;
use App\Models\Permission;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PermissionController extends Controller
{
    use HasResourcePermission;

    protected function resourcePermissionName(): string
    {
        return 'permission';
    }

    public function index(): Response
    {
        $this->authorizeResourcePermission('view');

        return Inertia::render('settings/system/permissions/index', [
            'permissions' => Permission::query()->orderBy('name')->get(),
            ...$this->resourcePermissionProps(),
        ]);
    }

    public function create(): Response
    {
        $this->authorizeResourcePermission('create');

        return Inertia::render('settings/system/permissions/index', [
            'permissions' => Permission::query()->orderBy('name')->get(),
            'formMode' => 'create',
            ...$this->resourcePermissionProps(),
        ]);
    }

    public function store(PermissionRequest $request): RedirectResponse
    {
        Permission::query()->create([
            'name' => $request->string('name')->toString(),
            'guard_name' => 'web',
        ]);

        return to_route('settings.system.permissions.index');
    }

    public function edit(Permission $permission): Response
    {
        $this->authorizeResourcePermission('update');

        return Inertia::render('settings/system/permissions/index', [
            'permissions' => Permission::query()->orderBy('name')->get(),
            'editingPermission' => $permission,
            'formMode' => 'edit',
            ...$this->resourcePermissionProps(),
        ]);
    }

    public function update(PermissionRequest $request, Permission $permission): RedirectResponse
    {
        $permission->update([
            'name' => $request->string('name')->toString(),
        ]);

        return to_route('settings.system.permissions.index');
    }

    public function destroy(Permission $permission): RedirectResponse
    {
        $this->authorizeResourcePermission('delete');
        $permission->delete();

        return to_route('settings.system.permissions.index');
    }
}
