<?php

use App\Http\Middleware\EnsureTenantIsEnabled;
use App\Models\Permission;
use App\Models\Staff;
use App\Models\User;
use Database\Seeders\NationalitySeeder;
use Inertia\Testing\AssertableInertia as Assert;

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

/**
 * @return array<string, mixed>
 */
function minimalStaffPayload(array $overrides = []): array
{
    return array_merge([
        'tab' => 'personal',
        'staff_number_source' => 'auto',
        'full_name' => 'Store Test Staff',
        'nric_passport' => '901010-10-1010',
        'gender' => '1',
        'date_of_birth' => '1990-01-01',
        'nationality' => 'Malaysia',
        'mobile_number' => '0123456789',
        'email' => 'store-test-staff@example.com',
        'employment_status' => 'active',
        'is_active' => '1',
        'enable_login' => '0',
        'is_enabled' => '0',
    ], $overrides);
}

test('creating staff without mobile_number returns server validation for mobile_number', function (): void {
    $actor = User::factory()->create();
    $actor->givePermissionTo(Permission::query()->create([
        'name' => 'create user',
        'guard_name' => 'web',
    ]));

    $response = $this->actingAs($actor)->post(
        route('settings.system.users.store'),
        minimalStaffPayload(['mobile_number' => '']),
    );

    $response->assertSessionHasErrors('mobile_number');
});

test('creating staff without work email returns server validation for email', function (): void {
    $actor = User::factory()->create();
    $actor->givePermissionTo(Permission::query()->create([
        'name' => 'create user',
        'guard_name' => 'web',
    ]));

    $response = $this->actingAs($actor)->post(
        route('settings.system.users.store'),
        minimalStaffPayload(['email' => '']),
    );

    $response->assertSessionHasErrors('email');
});

test('creating staff without nric_passport returns server validation for nric_passport', function (): void {
    $actor = User::factory()->create();
    $actor->givePermissionTo(Permission::query()->create([
        'name' => 'create user',
        'guard_name' => 'web',
    ]));

    $response = $this->actingAs($actor)->post(
        route('settings.system.users.store'),
        minimalStaffPayload(['nric_passport' => '']),
    );

    $response->assertSessionHasErrors('nric_passport');
});

test('creating staff without full_name returns server validation for full_name', function (): void {
    $actor = User::factory()->create();
    $actor->givePermissionTo(Permission::query()->create([
        'name' => 'create user',
        'guard_name' => 'web',
    ]));

    $response = $this->actingAs($actor)->post(
        route('settings.system.users.store'),
        minimalStaffPayload(['full_name' => '']),
    );

    $response->assertSessionHasErrors('full_name');
});

test('creating staff with auto staff_number assigns STF prefix', function (): void {
    $actor = User::factory()->create();
    $actor->givePermissionTo(Permission::query()->create([
        'name' => 'create user',
        'guard_name' => 'web',
    ]));

    $response = $this->actingAs($actor)->post(route('settings.system.users.store'), minimalStaffPayload([
        'staff_number_source' => 'auto',
    ]));

    $response->assertRedirect();

    $staff = Staff::query()->where('full_name', 'Store Test Staff')->first();
    expect($staff)->not->toBeNull()
        ->and($staff->staff_number)->toMatch('/^STF-\d{5}$/');
});

test('creating staff with manual staff_number stores exact value', function (): void {
    $actor = User::factory()->create();
    $actor->givePermissionTo(Permission::query()->create([
        'name' => 'create user',
        'guard_name' => 'web',
    ]));

    $response = $this->actingAs($actor)->post(route('settings.system.users.store'), minimalStaffPayload([
        'staff_number_source' => 'manual',
        'staff_number' => 'CLINIC-A-42',
    ]));

    $response->assertRedirect();

    expect(Staff::query()->where('staff_number', 'CLINIC-A-42')->exists())->toBeTrue();
});

test('creating staff persists structured address fields', function (): void {
    $actor = User::factory()->create();
    $actor->givePermissionTo(Permission::query()->create([
        'name' => 'create user',
        'guard_name' => 'web',
    ]));

    $response = $this->actingAs($actor)->post(route('settings.system.users.store'), minimalStaffPayload([
        'address_line_1' => 'Suite 5, Example Tower',
        'address_line_2' => 'Jalan Sample',
        'city' => 'Kuala Lumpur',
        'state' => 'Wilayah Persekutuan',
        'postcode' => '50450',
        'country' => 'Malaysia',
    ]));

    $response->assertRedirect();

    $staff = Staff::query()->where('full_name', 'Store Test Staff')->first();
    expect($staff)->not->toBeNull()
        ->and($staff->address_line_1)->toBe('Suite 5, Example Tower')
        ->and($staff->address_line_2)->toBe('Jalan Sample')
        ->and($staff->city)->toBe('Kuala Lumpur')
        ->and($staff->state)->toBe('Wilayah Persekutuan')
        ->and($staff->postcode)->toBe('50450')
        ->and($staff->country)->toBe('Malaysia');
});

test('staff create page includes nationality options for country dropdown', function (): void {
    $actor = User::factory()->create();
    $actor->givePermissionTo(Permission::query()->create([
        'name' => 'create user',
        'guard_name' => 'web',
    ]));

    $this->seed(NationalitySeeder::class);

    $this->actingAs($actor)
        ->get(route('settings.system.users.create'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('settings/system/staff/index')
            ->has('nationalities.0', fn (Assert $item) => $item
                ->has('id')
                ->has('name')
                ->has('iso3166_alpha2')));
});

test('creating staff with manual mode requires staff_number', function (): void {
    $actor = User::factory()->create();
    $actor->givePermissionTo(Permission::query()->create([
        'name' => 'create user',
        'guard_name' => 'web',
    ]));

    $payload = minimalStaffPayload([
        'staff_number_source' => 'manual',
    ]);
    unset($payload['staff_number']);

    $response = $this->actingAs($actor)->post(route('settings.system.users.store'), $payload);

    $response->assertSessionHasErrors('staff_number');
});
