<?php

use App\Http\Middleware\EnsureTenantIsEnabled;
use App\Models\Module;
use App\Models\Permission;
use App\Models\User;
use Database\Seeders\SettingsPermissionSeeder;

function migrateTenantSchemaForPermissionTests(): void
{
    config()->set('multitenancy.tenant_database_connection_name', config('database.default'));

    test()->withoutMiddleware(EnsureTenantIsEnabled::class);

    test()->artisan('migrate', [
        '--database' => config('database.default'),
        '--path' => 'database/migrations/tenant',
        '--realpath' => false,
        '--force' => true,
    ])->run();
}

test('legacy permission names continue authorizing settings actions during migration window', function () {
    migrateTenantSchemaForPermissionTests();

    $actor = User::factory()->create();
    $actor->givePermissionTo(Permission::query()->create([
        'name' => 'create role',
        'guard_name' => 'web',
    ]));

    test()->actingAs($actor)
        ->post(route('settings.system.roles.store'), ['name' => 'Billing Admin'])
        ->assertRedirect(route('settings.system.roles.index'))
        ->assertSessionHasNoErrors();
});

test('hierarchical permission names authorize settings actions', function () {
    migrateTenantSchemaForPermissionTests();

    $actor = User::factory()->create();
    $actor->givePermissionTo(Permission::query()->create([
        'name' => 'settings.system.roles.create',
        'guard_name' => 'web',
    ]));

    test()->actingAs($actor)
        ->post(route('settings.system.roles.store'), ['name' => 'Clinical Lead'])
        ->assertRedirect(route('settings.system.roles.index'))
        ->assertSessionHasNoErrors();
});

test('settings permission seeder creates only hierarchical permission keys', function () {
    migrateTenantSchemaForPermissionTests();

    test()->seed(SettingsPermissionSeeder::class);

    expect(Permission::query()->where('name', 'settings.system.roles.view')->exists())->toBeTrue()
        ->and(Permission::query()->where('name', 'settings.system.permissions.delete')->exists())->toBeTrue()
        ->and(Permission::query()->where('name', 'create role')->exists())->toBeFalse();
});

test('settings permission seeder assigns permissions to settings module', function () {
    migrateTenantSchemaForPermissionTests();

    test()->seed(SettingsPermissionSeeder::class);

    $settingsModule = Module::query()->where('key', 'settings')->first();
    $permission = Permission::query()->where('name', 'settings.system.roles.view')->first();

    expect($settingsModule)->not->toBeNull()
        ->and($permission)->not->toBeNull()
        ->and($permission?->module_id)->toBe($settingsModule?->id);
});
