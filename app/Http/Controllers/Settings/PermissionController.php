<?php

namespace App\Http\Controllers\Settings;

use App\Concerns\HasResourcePermission;
use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\PermissionRequest;
use App\Models\Permission;
use App\Models\Role;
use App\Support\SettingsPermissionName;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class PermissionController extends Controller
{
    use HasResourcePermission;

    protected function resourcePermissionName(): string
    {
        return 'permission';
    }

    public function index(Request $request): Response
    {
        $this->authorizeResourcePermission('view');
        $search = $request->string('search')->trim()->toString();

        return Inertia::render('settings/system/permissions/index', [
            'permissions' => Permission::query()
                ->when($search !== '', fn ($query) => $query->where('name', 'like', "%{$search}%"))
                ->orderBy('name')
                ->get(['id', 'name']),
            'filters' => [
                'search' => $search,
            ],
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
            'name' => SettingsPermissionName::normalizePermissionInput($request->string('name')->toString()),
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
            'name' => SettingsPermissionName::normalizePermissionInput($request->string('name')->toString()),
        ]);

        return to_route('settings.system.permissions.index');
    }

    public function destroy(Permission $permission): RedirectResponse
    {
        $this->authorizeResourcePermission('delete');

        $assignedRolesCount = Role::query()
            ->whereHas('permissions', fn ($query) => $query->whereKey($permission->getKey()))
            ->count();

        if ($assignedRolesCount > 0) {
            throw ValidationException::withMessages([
                'delete' => trans_choice(
                    'This permission is assigned to :count role. Remove it from roles before deleting.|This permission is assigned to :count roles. Remove it from roles before deleting.',
                    $assignedRolesCount,
                    ['count' => $assignedRolesCount]
                ),
            ]);
        }

        $permission->delete();

        return to_route('settings.system.permissions.index');
    }
}
