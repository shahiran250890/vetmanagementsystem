<?php

namespace App\Http\Controllers\Settings;

use App\Concerns\HasResourcePermission;
use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\UserManagementRequest;
use App\Http\Requests\Settings\UserStatusToggleRequest;
use App\Models\Role;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class UserManagementController extends Controller
{
    use HasResourcePermission;

    protected function resourcePermissionName(): string
    {
        return 'user';
    }

    public function index(): Response
    {
        $this->authorizeResourcePermission('view');
        $search = request()->string('search')->toString();

        return Inertia::render('settings/system/users/index', [
            'users' => $this->manageableUsers($search),
            'roles' => Role::query()->orderBy('name')->get(['id', 'name']),
            'filters' => [
                'search' => $search,
            ],
            ...$this->resourcePermissionProps(),
        ]);
    }

    public function create(): Response
    {
        $this->authorizeResourcePermission('create');

        return Inertia::render('settings/system/users/index', [
            'users' => $this->manageableUsers(),
            'roles' => Role::query()->orderBy('name')->get(['id', 'name']),
            'formMode' => 'create',
            ...$this->resourcePermissionProps(),
        ]);
    }

    public function store(UserManagementRequest $request): RedirectResponse
    {
        $user = User::query()->create([
            'name' => $request->string('name')->toString(),
            'email' => $request->string('email')->toString(),
            'phone' => $request->string('phone')->toString(),
            'is_enabled' => $request->boolean('is_enabled'),
            'password' => Hash::make($request->string('password')->toString()),
        ]);

        $user->syncRoles($request->input('role_ids', []));

        return to_route('settings.system.users.index');
    }

    public function edit(User $managed_user): Response
    {
        $this->authorizeResourcePermission('update');

        return Inertia::render('settings/system/users/index', [
            'users' => $this->manageableUsers(),
            'managedUser' => $managed_user->load('roles:id,name'),
            'roles' => Role::query()->orderBy('name')->get(['id', 'name']),
            'formMode' => 'edit',
            ...$this->resourcePermissionProps(),
        ]);
    }

    public function update(UserManagementRequest $request, User $managed_user): RedirectResponse
    {
        $payload = [
            'name' => $request->string('name')->toString(),
            'email' => $request->string('email')->toString(),
            'phone' => $request->string('phone')->toString(),
            'is_enabled' => $request->boolean('is_enabled'),
        ];

        if ($request->filled('password')) {
            $payload['password'] = Hash::make($request->string('password')->toString());
        }

        $managed_user->update($payload);
        $managed_user->syncRoles($request->input('role_ids', []));

        return to_route('settings.system.users.index');
    }

    public function destroy(User $managed_user): RedirectResponse
    {
        $this->authorizeResourcePermission('delete');
        $managed_user->delete();

        return to_route('settings.system.users.index');
    }

    public function toggleStatus(UserStatusToggleRequest $request, User $managed_user): RedirectResponse
    {
        $managed_user->update([
            'is_enabled' => $request->boolean('is_enabled'),
        ]);

        return to_route('settings.system.users.index');
    }

    private function manageableUsers(string $search = ''): LengthAwarePaginator
    {
        $currentUserId = Auth::id();

        return User::query()
            ->with('roles:id,name')
            ->where('id', '!=', 1)
            ->when($currentUserId !== null, fn (Builder $query) => $query->where('id', '!=', $currentUserId))
            ->when($search !== '', function (Builder $query) use ($search): void {
                $query->where(function (Builder $subQuery) use ($search): void {
                    $subQuery
                        ->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();
    }
}
