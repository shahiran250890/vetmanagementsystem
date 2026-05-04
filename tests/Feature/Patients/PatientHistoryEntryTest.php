<?php

use App\Models\Patients\Patient;
use App\Models\User;

test('history entry can be created for a patient', function () {
    $user = User::factory()->create();
    $patient = Patient::factory()->create();

    $response = $this
        ->actingAs($user)
        ->post(route('patients.history.store', $patient), [
            'entry_date' => now()->toDateString(),
            'visit_at' => now()->toDateTimeString(),
            'clinic_location' => 'Main Branch',
            'veterinarian_user_id' => $user->id,
            'assistant_user_id' => $user->id,
            'visit_type' => 'consultation',
            'appointment_id' => 'APT-1001',
            'visit_status' => 'completed',
            'entry_type' => 'consultation',
            'title' => 'Initial consultation',
            'details' => 'Patient presented with mild cough.',
        ]);

    $response->assertRedirect(route('patients.show', $patient));

    $entry = $patient->historyEntries()->latest('id')->first();

    $this->assertDatabaseHas('patient_history_entries', [
        'patient_id' => $patient->id,
        'created_by' => $user->id,
        'action' => 'manual.visit_log',
        'description' => 'Initial consultation',
    ]);

    expect($entry)->not->toBeNull();
    expect($entry?->metadata['visit_status'] ?? null)->toBe('completed');
});

test('history entry requires required fields', function () {
    $user = User::factory()->create();
    $patient = Patient::factory()->create();

    $response = $this
        ->actingAs($user)
        ->from(route('patients.show', $patient))
        ->post(route('patients.history.store', $patient), []);

    $response
        ->assertSessionHasErrors(['entry_date', 'visit_at', 'clinic_location', 'visit_type', 'visit_status', 'title', 'details'])
        ->assertRedirect(route('patients.show', $patient));
});
