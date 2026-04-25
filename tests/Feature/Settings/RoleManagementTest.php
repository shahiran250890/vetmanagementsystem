<?php

use App\Http\Middleware\EnsureTenantIsEnabled;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;

test('cannot delete a role that is assigned to users', function () {
    config()->set('multitenancy.tenant_database_connection_name', config('database.default'));
    $this->withoutMiddleware(EnsureTenantIsEnabled::class);
    $this->artisan('migrate', [
        '--database' => config('database.default'),
        '--path' => 'database/migrations/tenant',
        '--realpath' => false,
        '--force' => true,
    ])->run();

    $actor = User::factory()->create();
    $actor->givePermissionTo(Permission::query()->create([
        'name' => 'delete role',
        'guard_name' => 'web',
    ]));

    $role = Role::query()->create([
        'name' => 'Assigned Role',
        'guard_name' => 'web',
    ]);

    $assignedUser = User::factory()->create();
    $assignedUser->assignRole($role);

    $this->actingAs($actor)
        ->delete(route('settings.system.roles.destroy', $role))
        ->assertSessionHasErrors('delete');

    $this->assertDatabaseHas('roles', [
        'id' => $role->id,
    ]);
});

test('cannot delete superadmin role', function () {
    config()->set('multitenancy.tenant_database_connection_name', config('database.default'));
    $this->withoutMiddleware(EnsureTenantIsEnabled::class);
    $this->artisan('migrate', [
        '--database' => config('database.default'),
        '--path' => 'database/migrations/tenant',
        '--realpath' => false,
        '--force' => true,
    ])->run();

    $actor = User::factory()->create();
    $actor->givePermissionTo(Permission::query()->create([
        'name' => 'delete role',
        'guard_name' => 'web',
    ]));

    $role = Role::query()->create([
        'name' => 'superadmin',
        'guard_name' => 'web',
    ]);

    $this->actingAs($actor)
        ->delete(route('settings.system.roles.destroy', $role))
        ->assertSessionHasErrors([
            'delete' => 'The superadmin role cannot be deleted.',
        ]);

    $this->assertDatabaseHas('roles', [
        'id' => $role->id,
        'name' => 'superadmin',
    ]);
});
