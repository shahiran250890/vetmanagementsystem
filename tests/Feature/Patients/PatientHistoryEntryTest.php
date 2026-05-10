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
            'veterinarian_user_id' => $user->id,
            'assistant_user_id' => $user->id,
            'visit_type' => 'consultation',
            'appointment_id' => 'APT-1001',
            'visit_status' => 'completed',
            'entry_type' => 'consultation',
            'title' => 'Initial consultation',
            'symptoms' => 'Patient presented with mild cough.',
            'diagnosis' => 'Acute viral upper respiratory tract infection.',
            'details' => 'Legacy clinical notes for migration compatibility.',
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
    expect($entry?->metadata['symptoms'] ?? null)->toBe('Patient presented with mild cough.');
    expect($entry?->metadata['diagnosis'] ?? null)->toBe('Acute viral upper respiratory tract infection.');
});

test('history entry requires required core fields', function () {
    $user = User::factory()->create();
    $patient = Patient::factory()->create();

    $response = $this
        ->actingAs($user)
        ->from(route('patients.show', $patient))
        ->post(route('patients.history.store', $patient), []);

    $response
        ->assertSessionHasErrors(['entry_date', 'visit_at', 'visit_type', 'visit_status', 'title', 'symptoms'])
        ->assertRedirect(route('patients.show', $patient));
});

test('history entry requires diagnosis when saving completed visit', function () {
    $user = User::factory()->create();
    $patient = Patient::factory()->create();

    $response = $this
        ->actingAs($user)
        ->from(route('patients.show', $patient))
        ->post(route('patients.history.store', $patient), [
            'entry_date' => now()->toDateString(),
            'visit_at' => now()->toDateTimeString(),
            'visit_type' => 'consultation',
            'visit_status' => 'completed',
            'title' => 'Follow-up consultation',
            'symptoms' => 'Persistent dry cough.',
            'diagnosis' => '',
        ]);

    $response
        ->assertSessionHasErrors(['diagnosis'])
        ->assertRedirect(route('patients.show', $patient));
});

test('history entry allows waiting status without diagnosis', function () {
    $user = User::factory()->create();
    $patient = Patient::factory()->create();

    $response = $this
        ->actingAs($user)
        ->post(route('patients.history.store', $patient), [
            'entry_date' => now()->toDateString(),
            'visit_at' => now()->toDateTimeString(),
            'visit_type' => 'consultation',
            'visit_status' => 'waiting',
            'title' => 'Draft consultation note',
            'symptoms' => 'Mild sore throat.',
            'diagnosis' => '',
        ]);

    $response->assertRedirect(route('patients.show', $patient));
});
