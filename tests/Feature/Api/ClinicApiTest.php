<?php

use App\Enums\Billing\BillStatus;
use App\Http\Middleware\EnsureTenantIsEnabled;
use App\Models\Appointments\Appointment;
use App\Models\Billing\Bill;
use App\Models\Patients\Patient;
use App\Models\Patients\PatientHistoryEntry;
use App\Models\Role;
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

    foreach (['admin', 'doctor', 'receptionist', 'superadmin'] as $roleName) {
        Role::findOrCreate($roleName, 'web');
    }
});

test('clinic spa me endpoint resolves session user and roles', function (): void {
    $user = User::factory()->create();
    $user->assignRole('superadmin');

    $response = $this->actingAs($user, 'web')->getJson('/api/v1/me');

    $response->assertOk()
        ->assertJsonPath('success', true)
        ->assertJsonPath('data.email', $user->email);

    expect($response->json('data.roles'))->toContain('superadmin');
});

test('appointment api creates audit log entry', function (): void {
    $admin = User::factory()->create();
    $admin->assignRole('admin');
    $doctor = User::factory()->create();
    $doctor->assignRole('doctor');
    $patient = Patient::factory()->create();

    $response = $this->actingAs($admin)->postJson('/api/v1/appointments', [
        'patient_id' => $patient->id,
        'doctor_id' => $doctor->id,
        'appointment_datetime' => now()->addDay()->toDateTimeString(),
        'type' => 'scheduled',
        'status' => 'pending',
        'notes' => 'Follow-up',
    ]);

    $response->assertOk()
        ->assertJsonPath('success', true)
        ->assertJsonPath('data.doctor_id', $doctor->id);

    expect(PatientHistoryEntry::query()->where('action', 'appointment.created')->count())->toBe(1);
});

test('doctor cannot view another doctors appointment', function (): void {
    $admin = User::factory()->create();
    $admin->assignRole('admin');
    $doctorA = User::factory()->create();
    $doctorA->assignRole('doctor');
    $doctorB = User::factory()->create();
    $doctorB->assignRole('doctor');
    $patient = Patient::factory()->create();

    $appointment = Appointment::factory()->create([
        'patient_id' => $patient->id,
        'doctor_id' => $doctorA->id,
    ]);

    $this->actingAs($doctorB)->getJson("/api/v1/appointments/{$appointment->id}")
        ->assertForbidden();

    $this->actingAs($doctorA)->getJson("/api/v1/appointments/{$appointment->id}")
        ->assertOk()
        ->assertJsonPath('success', true);
});

test('payment marks bill paid when total covered', function (): void {
    $admin = User::factory()->create();
    $admin->assignRole('admin');
    $patient = Patient::factory()->create();

    $billResponse = $this->actingAs($admin)->postJson('/api/v1/bills', [
        'patient_id' => $patient->id,
        'status' => BillStatus::Unpaid->value,
        'items' => [
            [
                'item_type' => 'consultation',
                'description' => 'Visit',
                'amount' => 100,
            ],
        ],
    ]);

    $billResponse->assertOk();
    $billId = (int) $billResponse->json('data.id');

    $this->actingAs($admin)->postJson('/api/v1/payments', [
        'bill_id' => $billId,
        'amount' => 100,
        'method' => 'cash',
        'paid_at' => now()->toDateTimeString(),
    ])->assertOk();

    expect(Bill::query()->find($billId)?->status)->toBe(BillStatus::Paid);
});
