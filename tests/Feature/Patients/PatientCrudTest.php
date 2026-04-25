<?php

use App\Models\Patients\BloodType;
use App\Models\Patients\Patient;
use App\Models\User;

test('patients index requires authentication', function () {
    $response = $this->get('/patients');

    $response->assertRedirect(route('login'));
});

test('patient can be created', function () {
    $user = User::factory()->create();
    $owner = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->post(route('patients.store'), [
            'patient_type' => 'animal',
            'name' => 'Milo',
            'status' => 'active',
            'animal_profile' => [
                'owner_user_id' => $owner->id,
                'species' => 'Canine',
            ],
        ]);

    $patient = Patient::query()->first();

    $response->assertRedirect(route('patients.show', $patient));

    expect($patient)->not->toBeNull();
    expect($patient->name)->toBe('Milo');
    expect($patient->user_id)->toBe($owner->id);
    expect($patient->patient_type)->toBe('animal');
    expect($patient->animalProfile?->species)->toBe('Canine');
});

test('patient validation errors are returned when required fields are missing', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->from(route('patients.create'))
        ->post(route('patients.store'), []);

    $response
        ->assertSessionHasErrors(['patient_type', 'name', 'status'])
        ->assertRedirect(route('patients.create'));
});

test('patient can be updated', function () {
    $user = User::factory()->create();
    $patient = Patient::factory()->create([
        'patient_type' => 'animal',
        'name' => 'Old Name',
        'species' => 'Canine',
        'status' => 'active',
    ]);

    $response = $this
        ->actingAs($user)
        ->put(route('patients.update', $patient), [
            'patient_type' => 'animal',
            'name' => 'New Name',
            'status' => 'transferred',
            'animal_profile' => [
                'species' => 'Feline',
            ],
        ]);

    $response->assertRedirect(route('patients.show', $patient));

    $patient->refresh();

    expect($patient->name)->toBe('New Name');
    expect($patient->species)->toBe('Feline');
    expect($patient->status)->toBe('transferred');
    expect($patient->animalProfile?->species)->toBe('Feline');
});

test('human patient can be created', function () {
    $user = User::factory()->create();
    $bloodType = BloodType::query()->create(['name' => 'O+']);

    $response = $this
        ->actingAs($user)
        ->post(route('patients.store'), [
            'patient_type' => 'human',
            'name' => 'John Carter',
            'status' => 'active',
            'human_profile' => [
                'identification_number' => 'MY-990101',
                'blood_type_id' => $bloodType->id,
                'primary_phone' => '+60123456789',
                'address' => 'Kuala Lumpur',
                'height_cm' => 175.5,
                'weight_kg' => 72.3,
                'blood_pressure' => '120/80',
                'vital_medical_information' => 'Asthma history and penicillin allergy.',
            ],
        ]);

    $patient = Patient::query()->latest()->first();

    $response->assertRedirect(route('patients.show', $patient));

    expect($patient)->not->toBeNull();
    expect($patient->patient_type)->toBe('human');
    expect($patient->humanProfile?->blood_type_id)->toBe($bloodType->id);
    expect($patient->humanProfile?->blood_type)->toBe('O+');
    expect($patient->humanProfile?->height_cm)->toBe('175.50');
    expect($patient->humanProfile?->weight_kg)->toBe('72.30');
    expect($patient->humanProfile?->blood_pressure)->toBe('120/80');
});
