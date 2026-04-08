<?php

namespace App\Http\Controllers\Settings;

use App\Concerns\HasResourcePermission;
use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\RoleRequest;
use App\Models\Permission;
use App\Models\Role;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class RoleController extends Controller
{
    use HasResourcePermission;

    protected function resourcePermissionName(): string
    {
        return 'role';
    }

    public function index(): Response
    {
        $this->authorizeResourcePermission('view');

        return Inertia::render('settings/system/roles/index', [
            'roles' => Role::query()->with('permissions:id,name')->orderBy('name')->get(),
            ...$this->resourcePermissionProps(),
        ]);
    }

    public function create(): Response
    {
        $this->authorizeResourcePermission('create');

        return Inertia::render('settings/system/roles/index', [
            'roles' => Role::query()->with('permissions:id,name')->orderBy('name')->get(),
            'permissions' => Permission::query()->orderBy('name')->get(['id', 'name']),
            'formMode' => 'create',
            ...$this->resourcePermissionProps(),
        ]);
    }

    public function store(RoleRequest $request): RedirectResponse
    {
        $role = Role::query()->create([
            'name' => $request->string('name')->toString(),
            'guard_name' => 'web',
        ]);

        $role->syncPermissions($request->input('permission_ids', []));

        return to_route('settings.system.roles.index');
    }

    public function edit(Role $role): Response
    {
        $this->authorizeResourcePermission('update');

        return Inertia::render('settings/system/roles/index', [
            'roles' => Role::query()->with('permissions:id,name')->orderBy('name')->get(),
            'editingRole' => $role->load('permissions:id,name'),
            'permissions' => Permission::query()->orderBy('name')->get(['id', 'name']),
            'formMode' => 'edit',
            ...$this->resourcePermissionProps(),
        ]);
    }

    public function update(RoleRequest $request, Role $role): RedirectResponse
    {
        $role->update([
            'name' => $request->string('name')->toString(),
        ]);
        $role->syncPermissions($request->input('permission_ids', []));

        return to_route('settings.system.roles.index');
    }

    public function destroy(Role $role): RedirectResponse
    {
        $this->authorizeResourcePermission('delete');
        $role->delete();

        return to_route('settings.system.roles.index');
    }
}
