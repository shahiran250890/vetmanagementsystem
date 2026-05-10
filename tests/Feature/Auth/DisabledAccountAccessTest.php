<?php

use App\Http\Middleware\EnsureTenantIsEnabled;
use App\Models\Staff;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

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

test('valid credentials for a disabled user redirect to the access denied screen', function () {
    User::factory()->create([
        'email' => 'disabled-access@example.test',
        'password' => Hash::make('password'),
        'is_enabled' => false,
    ]);

    $response = $this->post(route('login.store'), [
        'email' => 'disabled-access@example.test',
        'password' => 'password',
    ]);

    $response->assertRedirect(route('login.access-denied'));
    $this->assertGuest();
});

test('disabled user is logged out on the next request', function () {
    $user = User::factory()->create([
        'is_enabled' => true,
    ]);

    $this->actingAs($user);

    User::query()->whereKey($user->id)->update(['is_enabled' => false]);

    $this->get(route('dashboard'))
        ->assertRedirect(route('login.access-denied'));

    $this->assertGuest();
});

test('staff is_active does not block login when user is enabled', function () {
    $staff = Staff::factory()->create([
        'is_active' => false,
    ]);

    $user = User::factory()->create([
        'staff_id' => $staff->id,
        'email' => 'enabled-user-with-inactive-staff@example.test',
        'password' => Hash::make('password'),
        'is_enabled' => true,
    ]);

    $response = $this->post(route('login.store'), [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $response->assertRedirect(route('dashboard'));
    $this->assertAuthenticatedAs($user);
});
