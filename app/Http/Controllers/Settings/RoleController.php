<?php

namespace App\Http\Controllers\Settings;

use App\Concerns\HasResourcePermission;
use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\RoleRequest;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RoleController extends Controller
{
    use HasResourcePermission;

    protected function resourcePermissionName(): string
    {
        return 'role';
    }

    public function index(Request $request): Response
    {
        $this->authorizeResourcePermission('view');

        $search = $request->string('search')->trim()->toString();

        return Inertia::render('settings/system/roles/index', [
            'roles' => Role::query()
                ->with('permissions:id,name')
                ->when($search !== '', fn ($query) => $query->where('name', 'like', "%{$search}%"))
                ->orderBy('name')
                ->paginate(10)
                ->withQueryString(),
            'filters' => [
                'search' => $search,
            ],
            ...$this->resourcePermissionProps(),
        ]);
    }

    public function create(): Response
    {
        $this->authorizeResourcePermission('create');

        return Inertia::render('settings/system/roles/index', [
            'permissions' => Permission::query()->orderBy('name')->get(['id', 'name']),
            'formMode' => 'create',
            ...$this->resourcePermissionProps(),
        ]);
    }

    public function show(Role $role): Response
    {
        $this->authorizeResourcePermission('view');

        return Inertia::render('settings/system/roles/show', [
            'role' => $role->load('permissions:id,name'),
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

        if (strcasecmp($role->name, 'superadmin') === 0) {
            throw ValidationException::withMessages([
                'delete' => 'The superadmin role cannot be deleted.',
            ]);
        }

        $assignedUsersCount = User::query()
            ->whereHas('roles', fn ($query) => $query->whereKey($role->getKey()))
            ->count();

        if ($assignedUsersCount > 0) {
            throw ValidationException::withMessages([
                'delete' => trans_choice(
                    'This role is assigned to :count user. Reassign users before deleting.|This role is assigned to :count users. Reassign users before deleting.',
                    $assignedUsersCount,
                    ['count' => $assignedUsersCount]
                ),
            ]);
        }

        $role->delete();

        return to_route('settings.system.roles.index');
    }
}
