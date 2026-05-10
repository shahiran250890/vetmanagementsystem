<?php

use App\Http\Middleware\EnsureTenantIsEnabled;
use App\Models\Permission;
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

test('toggle status updates user is_enabled and leaves staff is_active unchanged', function (): void {
    $actor = User::factory()->create();
    $actor->givePermissionTo(Permission::query()->create([
        'name' => 'update user',
        'guard_name' => 'web',
    ]));

    $managedUser = User::factory()->create([
        'is_enabled' => true,
    ]);
    $staff = $managedUser->fresh()->staff;
    $this->assertNotNull($staff);
    $staff->update(['is_active' => true]);
    $staffWasActive = $staff->fresh()->is_active;

    $this->actingAs($actor)
        ->patch(route('settings.system.users.toggle-status', $staff), [
            'is_enabled' => false,
        ])
        ->assertRedirect(route('settings.system.users.index'));

    expect($managedUser->fresh()->is_enabled)->toBeFalse();
    expect($staff->fresh()->is_active)->toBe($staffWasActive);
});

test('bulk status updates is_enabled only for rows with a login user', function (): void {
    $actor = User::factory()->create();
    $actor->givePermissionTo(Permission::query()->create([
        'name' => 'update user',
        'guard_name' => 'web',
    ]));

    $withLogin = User::factory()->create(['is_enabled' => false]);
    $staffWithUser = $withLogin->fresh()->staff;
    $this->assertNotNull($staffWithUser);

    $staffNoUser = Staff::factory()->create();

    $this->actingAs($actor)
        ->post(route('settings.system.users.bulk-status'), [
            'staff_ids' => [$staffWithUser->id, $staffNoUser->id],
            'is_enabled' => true,
        ])
        ->assertRedirect(route('settings.system.users.index'));

    expect($withLogin->fresh()->is_enabled)->toBeTrue();
});
