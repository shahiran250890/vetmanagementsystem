<?php

use App\Http\Middleware\EnsureTenantIsEnabled;
use App\Models\Permission;
use App\Models\Role;
use App\Models\Staff;
use App\Models\User;

beforeEach(function (): void {
    config(['multitenancy.tenant_database_connection_name' => config('database.default')]);
    $this->withoutMiddleware(EnsureTenantIsEnabled::class);
    $this->artisan('migrate', [
        '--database' => config('database.default'),
        '--path' => 'database/migrations/tenant',
        '--realpath' => false,
        '--force' => true,
    ])->run();
});

test('create requires personal tab first', function (): void {
    $actor = User::factory()->create();
    $actor->givePermissionTo(Permission::query()->create([
        'name' => 'create user',
        'guard_name' => 'web',
    ]));

    $response = $this->actingAs($actor)->post(route('settings.system.users.store'), [
        'tab' => 'employment',
        'employment_status' => 'active',
        'is_active' => '1',
    ]);

    $response->assertSessionHasErrors('tab');
});

test('employment tab update only validates employment fields', function (): void {
    $actor = User::factory()->create();
    $actor->givePermissionTo(Permission::query()->create([
        'name' => 'update user',
        'guard_name' => 'web',
    ]));

    $staff = Staff::factory()->create([
        'full_name' => 'Original Name',
        'employment_status' => 'active',
        'is_active' => true,
    ]);

    $response = $this->actingAs($actor)->put(route('settings.system.users.update', $staff), [
        'tab' => 'employment',
        'employment_status' => 'probation',
        'is_active' => '1',
        'department' => 'Veterinary',
    ]);

    $response->assertRedirect(route('settings.system.users.edit', [
        'managed_staff' => $staff->id,
        'tab' => 'professional',
    ]));

    expect($staff->fresh()->employment_status)->toBe('probation')
        ->and($staff->fresh()->department)->toBe('Veterinary')
        ->and($staff->fresh()->full_name)->toBe('Original Name');
});

test('roles tab update syncs roles for linked user only', function (): void {
    $actor = User::factory()->create();
    $actor->givePermissionTo(Permission::query()->create([
        'name' => 'update user',
        'guard_name' => 'web',
    ]));

    $staffUser = User::factory()->create();
    $staff = $staffUser->fresh()->staff;
    expect($staff)->not->toBeNull();

    $roleA = Role::query()->firstOrCreate(['name' => 'doctor', 'guard_name' => 'web']);
    $roleB = Role::query()->firstOrCreate(['name' => 'nurse', 'guard_name' => 'web']);

    $response = $this->actingAs($actor)->put(route('settings.system.users.update', $staff), [
        'tab' => 'roles',
        'role_ids' => [$roleA->id, $roleB->id],
    ]);

    $response->assertRedirect(route('settings.system.users.edit', [
        'managed_staff' => $staff->id,
        'tab' => 'documents',
    ]));

    $staffUser->refresh();
    expect($staffUser->roles->pluck('id')->sort()->values()->all())->toBe([$roleA->id, $roleB->id]);
});
