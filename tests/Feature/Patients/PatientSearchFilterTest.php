<?php

use App\Models\Patients\Patient;
use App\Models\User;

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

test('patient index includes both human and animal labels', function () {
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
