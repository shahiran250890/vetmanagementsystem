<?php

use App\Models\Patients\Patient;
use App\Models\User;

test('patient index supports search', function () {
    $user = User::factory()->create();
    Patient::factory()->create(['name' => 'Shadow']);
    Patient::factory()->create(['name' => 'Luna']);

    $response = $this
        ->actingAs($user)
        ->get(route('patients.index', ['search' => 'Shadow']));

    $response->assertOk();
    $response->assertSee('Shadow');
    $response->assertDontSee('Luna');
});

test('patient index supports status filter', function () {
    $user = User::factory()->create();
    Patient::factory()->create(['name' => 'Alpha', 'status' => 'active']);
    Patient::factory()->create(['name' => 'Bravo', 'status' => 'deceased']);

    $response = $this
        ->actingAs($user)
        ->get(route('patients.index', ['status' => 'deceased']));

    $response->assertOk();
    $response->assertSee('Bravo');
    $response->assertDontSee('Alpha');
});
