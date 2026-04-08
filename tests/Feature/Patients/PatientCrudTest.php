<?php

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
            'user_id' => $owner->id,
            'name' => 'Milo',
            'species' => 'Canine',
            'status' => 'active',
        ]);

    $patient = Patient::query()->first();

    $response->assertRedirect(route('patients.show', $patient));

    expect($patient)->not->toBeNull();
    expect($patient->name)->toBe('Milo');
    expect($patient->user_id)->toBe($owner->id);
});

test('patient validation errors are returned when required fields are missing', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->from(route('patients.create'))
        ->post(route('patients.store'), []);

    $response
        ->assertSessionHasErrors(['name', 'species', 'status'])
        ->assertRedirect(route('patients.create'));
});

test('patient can be updated', function () {
    $user = User::factory()->create();
    $patient = Patient::factory()->create([
        'name' => 'Old Name',
        'species' => 'Canine',
        'status' => 'active',
    ]);

    $response = $this
        ->actingAs($user)
        ->put(route('patients.update', $patient), [
            'name' => 'New Name',
            'species' => 'Feline',
            'status' => 'transferred',
        ]);

    $response->assertRedirect(route('patients.show', $patient));

    $patient->refresh();

    expect($patient->name)->toBe('New Name');
    expect($patient->species)->toBe('Feline');
    expect($patient->status)->toBe('transferred');
});
