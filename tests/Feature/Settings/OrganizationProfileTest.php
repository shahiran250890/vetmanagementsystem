<?php

use App\Http\Middleware\EnsureTenantIsEnabled;
use App\Models\Permission;
use App\Models\Settings\OrganizationProfile;
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

test('organization profile page is displayed', function () {
    $actor = User::factory()->create();
    $actor->givePermissionTo(Permission::query()->create([
        'name' => 'view system setting',
        'guard_name' => 'web',
    ]));

    $this->actingAs($actor)
        ->get(route('settings.system.organization.edit'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component('settings/system/organization/index'));
});

test('organization profile is required and can be saved', function () {
    $actor = User::factory()->create();
    $actor->givePermissionTo(Permission::query()->create([
        'name' => 'update system setting',
        'guard_name' => 'web',
    ]));

    $this->actingAs($actor)
        ->from(route('settings.system.organization.edit'))
        ->put(route('settings.system.organization.update'), [])
        ->assertRedirect(route('settings.system.organization.edit'))
        ->assertSessionHasErrors([
            'clinic_type',
            'organization_name',
            'organization_phone',
            'organization_email',
            'organization_fax',
            'organization_license',
        ]);

    $payload = [
        'clinic_type' => 'vet',
        'organization_name' => 'Vet Prime Clinic',
        'organization_phone' => '+60399887766',
        'organization_email' => 'hello@vetprime.test',
        'organization_fax' => '+60399887700',
        'organization_license' => 'VET-LIC-0099',
    ];

    $this->actingAs($actor)
        ->put(route('settings.system.organization.update'), $payload)
        ->assertRedirect(route('settings.system.organization.edit'))
        ->assertSessionHasNoErrors();

    $this->assertDatabaseHas('organization_profiles', $payload);

    expect(OrganizationProfile::query()->count())->toBe(1);
});

test('species management is forbidden when clinic type is human', function () {
    $actor = User::factory()->create();
    $actor->givePermissionTo(Permission::query()->create([
        'name' => 'view species',
        'guard_name' => 'web',
    ]));

    OrganizationProfile::query()->create([
        'clinic_type' => 'human',
        'organization_name' => 'Human Care',
        'organization_phone' => '+60312345678',
        'organization_email' => 'care@human.test',
        'organization_fax' => '+60312345670',
        'organization_license' => 'HC-2026',
    ]);

    $this->actingAs($actor)
        ->get(route('settings.system.species.index'))
        ->assertForbidden();
});
