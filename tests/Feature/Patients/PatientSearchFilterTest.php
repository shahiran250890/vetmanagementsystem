<?php

use App\Http\Middleware\EnsureTenantIsEnabled;
use App\Models\Patients\Patient;
use App\Models\Settings\OrganizationProfile;
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

test('patient index supports search', function () {
    $user = User::factory()->create();
    Patient::factory()->create([
        'patient_type' => 'animal',
        'name' => 'Shadow',
    ]);
    Patient::factory()->create([
        'patient_type' => 'human',
        'name' => 'Luna',
    ]);

    $response = $this
        ->actingAs($user)
        ->get(route('patients.index', ['search' => 'Shadow']));

    $response->assertOk();
    $response->assertSee('Shadow');
    $response->assertDontSee('Luna');
});

test('patient index supports status filter', function () {
    $user = User::factory()->create();
    Patient::factory()->create([
        'patient_type' => 'animal',
        'name' => 'Alpha',
        'status' => 'active',
    ]);
    Patient::factory()->create([
        'patient_type' => 'human',
        'name' => 'Bravo',
        'status' => 'deceased',
    ]);

    $response = $this
        ->actingAs($user)
        ->get(route('patients.index', ['status' => 'deceased']));

    $response->assertOk();
    $response->assertSee('Bravo');
    $response->assertDontSee('Alpha');
});

test('patient index includes both human and animal labels when clinic type is not set', function () {
    $user = User::factory()->create();
    Patient::factory()->create(['patient_type' => 'animal', 'name' => 'Animal Record']);
    Patient::factory()->create(['patient_type' => 'human', 'name' => 'Human Record']);

    $response = $this
        ->actingAs($user)
        ->get(route('patients.index'));

    $response->assertOk();
    $response->assertSee('animal');
    $response->assertSee('human');
});

test('patient index shows only human patients when clinic type is human', function () {
    $user = User::factory()->create();
    OrganizationProfile::query()->create([
        'clinic_type' => 'human',
        'organization_name' => 'Human Clinic',
        'organization_phone' => '+60111111111',
        'organization_email' => 'clinic@example.test',
        'organization_fax' => '+60111111112',
        'organization_license' => 'HC-LIC-1',
        'organization_address' => '1 Jalan Test',
    ]);
    Patient::factory()->create(['patient_type' => 'animal', 'name' => 'Pet Only']);
    Patient::factory()->create(['patient_type' => 'human', 'name' => 'Person One']);

    $response = $this
        ->actingAs($user)
        ->get(route('patients.index'));

    $response->assertOk();
    $response->assertSee('Person One');
    $response->assertDontSee('Pet Only');
});

test('patient index shows only animal patients when clinic type is vet', function () {
    $user = User::factory()->create();
    OrganizationProfile::query()->create([
        'clinic_type' => 'vet',
        'organization_name' => 'Vet Clinic',
        'organization_phone' => '+60222222222',
        'organization_email' => 'vet@example.test',
        'organization_fax' => '+60222222223',
        'organization_license' => 'VET-9',
        'organization_address' => '2 Jalan Vet',
    ]);
    Patient::factory()->create(['patient_type' => 'animal', 'name' => 'Creature']);
    Patient::factory()->create(['patient_type' => 'human', 'name' => 'Doc Patient']);

    $response = $this
        ->actingAs($user)
        ->get(route('patients.index'));

    $response->assertOk();
    $response->assertSee('Creature');
    $response->assertDontSee('Doc Patient');
});
