<?php

use App\Http\Middleware\EnsureTenantIsEnabled;
use App\Models\Medical\MedicalCertificate;
use App\Models\Medical\MedicalRecord;
use App\Models\Patients\Patient;
use App\Models\Role;
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

    foreach (['admin', 'superadmin', 'doctor', 'receptionist', 'nurse'] as $roleName) {
        Role::findOrCreate($roleName, 'web');
    }

    OrganizationProfile::query()->create([
        'clinic_type' => 'human',
        'organization_name' => 'Human Clinic',
        'organization_phone' => '+60111111111',
        'organization_email' => 'clinic@example.test',
        'organization_fax' => '+60111111112',
        'organization_license' => 'HC-LIC-1',
        'organization_address' => '1 Jalan Test, Kuala Lumpur',
    ]);
});

test('nurse cannot open medical certificate create page', function (): void {
    $user = User::factory()->create();
    $user->assignRole('nurse');
    $patient = Patient::factory()->human()->create();

    $this->actingAs($user)
        ->get(route('patients.medical-certificates.create', $patient))
        ->assertForbidden();
});

test('doctor can issue medical certificate for human patient', function (): void {
    $doctor = User::factory()->create(['mmc_registration_number' => '123456']);
    $doctor->assignRole('doctor');
    $patient = Patient::factory()->human()->create(['name' => 'Ahmad']);

    $response = $this->actingAs($doctor)
        ->post(route('patients.medical-certificates.store', $patient), [
            'medical_record_id' => null,
            'employer_name' => 'ACME Sdn Bhd',
            'unfit_from' => '2026-05-01',
            'unfit_to' => '2026-05-03',
            'remarks' => 'Rest at home.',
        ]);

    $response->assertRedirect(route('patients.show', $patient));

    $certificate = MedicalCertificate::query()->first();
    expect($certificate)->not->toBeNull();
    expect($certificate->patient_id)->toBe($patient->id);
    expect($certificate->doctor_id)->toBe($doctor->id);
    expect($certificate->employer_name)->toBe('ACME Sdn Bhd');
    expect($certificate->certificate_number)->toStartWith('MC-2026-');
    expect($certificate->status->value)->toBe('issued');
});

test('animal patient cannot receive medical certificate', function (): void {
    $doctor = User::factory()->create();
    $doctor->assignRole('doctor');
    $patient = Patient::factory()->create(['patient_type' => 'animal']);

    $this->actingAs($doctor)
        ->from(route('patients.show', $patient))
        ->post(route('patients.medical-certificates.store', $patient), [
            'unfit_from' => '2026-05-01',
            'unfit_to' => '2026-05-02',
        ])
        ->assertRedirect(route('patients.show', $patient))
        ->assertSessionHasErrors('patient_id');
});

test('medical certificate is blocked when organization clinic type is vet', function (): void {
    OrganizationProfile::query()->update(['clinic_type' => 'vet']);

    $doctor = User::factory()->create();
    $doctor->assignRole('doctor');
    $patient = Patient::factory()->human()->create();

    $this->actingAs($doctor)
        ->from(route('patients.show', $patient))
        ->post(route('patients.medical-certificates.store', $patient), [
            'unfit_from' => '2026-05-01',
            'unfit_to' => '2026-05-02',
        ])
        ->assertRedirect(route('patients.show', $patient))
        ->assertSessionHasErrors('clinic_type');
});

test('medical record must belong to the same patient', function (): void {
    $doctor = User::factory()->create();
    $doctor->assignRole('doctor');
    $patient = Patient::factory()->human()->create();
    $otherPatient = Patient::factory()->human()->create();

    $foreignRecord = MedicalRecord::factory()->create([
        'patient_id' => $otherPatient->id,
        'doctor_id' => $doctor->id,
    ]);

    $this->actingAs($doctor)
        ->from(route('patients.show', $patient))
        ->post(route('patients.medical-certificates.store', $patient), [
            'medical_record_id' => $foreignRecord->id,
            'unfit_from' => '2026-05-01',
            'unfit_to' => '2026-05-02',
        ])
        ->assertRedirect(route('patients.show', $patient))
        ->assertSessionHasErrors('medical_record_id');
});

test('doctor cannot void another doctors certificate', function (): void {
    $doctorA = User::factory()->create();
    $doctorA->assignRole('doctor');
    $doctorB = User::factory()->create();
    $doctorB->assignRole('doctor');
    $patient = Patient::factory()->human()->create();

    $certificate = MedicalCertificate::factory()
        ->forPatient($patient)
        ->forDoctor($doctorA)
        ->issued()
        ->create();

    $this->actingAs($doctorB)
        ->post(route('patients.medical-certificates.void', [$patient, $certificate]), [
            'void_reason' => 'Mistake',
        ])
        ->assertForbidden();
});

test('receptionist can void any medical certificate', function (): void {
    $doctor = User::factory()->create();
    $doctor->assignRole('doctor');
    $receptionist = User::factory()->create();
    $receptionist->assignRole('receptionist');
    $patient = Patient::factory()->human()->create();

    $certificate = MedicalCertificate::factory()
        ->forPatient($patient)
        ->forDoctor($doctor)
        ->issued()
        ->create();

    $this->actingAs($receptionist)
        ->post(route('patients.medical-certificates.void', [$patient, $certificate]), [
            'void_reason' => 'Patient requested cancellation.',
        ])
        ->assertRedirect(route('patients.show', $patient));

    $certificate->refresh();
    expect($certificate->status->value)->toBe('voided');
    expect($certificate->void_reason)->toBe('Patient requested cancellation.');
});

test('print view is available to authorized viewer', function (): void {
    $doctor = User::factory()->create();
    $doctor->assignRole('doctor');
    $patient = Patient::factory()->human()->create();

    $certificate = MedicalCertificate::factory()
        ->forPatient($patient)
        ->forDoctor($doctor)
        ->issued()
        ->create();

    $this->actingAs($doctor)
        ->get(route('patients.medical-certificates.print', [$patient, $certificate]))
        ->assertOk()
        ->assertSeeText('Medical Certificate / Sick Leave')
        ->assertSeeText($patient->name);
});
