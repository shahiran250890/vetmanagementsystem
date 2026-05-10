<?php

use App\Http\Middleware\EnsureTenantIsEnabled;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    config()->set('multitenancy.tenant_database_connection_name', config('database.default'));
    $this->withoutMiddleware(EnsureTenantIsEnabled::class);
    $this->artisan('migrate', [
        '--database' => config('database.default'),
        '--path' => 'database/migrations/tenant',
        '--realpath' => false,
        '--force' => true,
    ])->run();
});

test('user detail page is displayed', function () {
    $actor = User::factory()->create();
    $actor->givePermissionTo(Permission::query()->create([
        'name' => 'view user',
        'guard_name' => 'web',
    ]));

    $managedUser = User::factory()->create([
        'name' => 'Staff One',
    ]);
    $managedStaff = $managedUser->fresh()->staff;
    $this->assertNotNull($managedStaff);

    $role = Role::query()->create([
        'name' => 'doctor',
        'guard_name' => 'web',
    ]);
    $managedUser->assignRole($role);

    $this->actingAs($actor)
        ->get(route('settings.system.users.show', $managedStaff))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('settings/system/staff/view')
            ->where('managedStaff.id', $managedStaff->id)
            ->where('managedStaff.full_name', 'Staff One')
            ->has('managedStaff.roles', 1));
});

test('role detail page is displayed', function () {
    $actor = User::factory()->create();
    $actor->givePermissionTo(Permission::query()->create([
        'name' => 'view role',
        'guard_name' => 'web',
    ]));

    $permission = Permission::query()->create([
        'name' => 'view species',
        'guard_name' => 'web',
    ]);
    $role = Role::query()->create([
        'name' => 'receptionist',
        'guard_name' => 'web',
    ]);
    $role->givePermissionTo($permission);

    $this->actingAs($actor)
        ->get(route('settings.system.roles.show', $role))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('settings/system/roles/show')
            ->where('role.id', $role->id)
            ->where('role.name', 'receptionist')
            ->has('role.permissions', 1));
});

test('permission detail page is displayed', function () {
    $actor = User::factory()->create();
    $actor->givePermissionTo(Permission::query()->create([
        'name' => 'view permission',
        'guard_name' => 'web',
    ]));

    $permission = Permission::query()->create([
        'name' => 'create user',
        'guard_name' => 'web',
    ]);
    $role = Role::query()->create([
        'name' => 'manager',
        'guard_name' => 'web',
    ]);
    $role->givePermissionTo($permission);

    $this->actingAs($actor)
        ->get(route('settings.system.permissions.show', $permission))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('settings/system/permissions/show')
            ->where('permission.id', $permission->id)
            ->where('permission.name', 'create user')
            ->has('permission.roles', 1));
});
