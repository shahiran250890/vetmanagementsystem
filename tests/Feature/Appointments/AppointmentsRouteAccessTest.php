<?php

use App\Http\Middleware\EnsureTenantIsEnabled;
use App\Models\Role;
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

    foreach (['admin', 'doctor', 'receptionist', 'nurse'] as $roleName) {
        Role::findOrCreate($roleName, 'web');
    }
});

test('nurse cannot access appointments inertia routes', function (): void {
    $user = User::factory()->create();
    $user->assignRole('nurse');

    $this->actingAs($user)->get('/appointments')->assertForbidden();
    $this->actingAs($user)->get('/appointments/create')->assertForbidden();
    $this->actingAs($user)->get('/appointments/1/edit')->assertForbidden();
});

test('receptionist can access appointments index', function (): void {
    $user = User::factory()->create();
    $user->assignRole('receptionist');

    $this->actingAs($user)->get('/appointments')->assertOk();
});
