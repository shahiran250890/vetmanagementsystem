<?php

namespace App\Modules\Appointments\Application\Services;

use App\Enums\Appointments\AppointmentStatus;
use App\Enums\Appointments\AppointmentType;
use App\Models\Appointments\Appointment;
use App\Modules\Appointments\Events\AppointmentCreated;
use Illuminate\Support\Facades\DB;

class AppointmentService
{
    /**
     * @param  array<string, mixed>  $validated
     */
    public function create(array $validated): Appointment
    {
        return DB::transaction(function () use ($validated): Appointment {
            $appointment = Appointment::query()->create([
                'patient_id' => $validated['patient_id'],
                'doctor_id' => $validated['doctor_id'],
                'appointment_datetime' => $validated['appointment_datetime'],
                'type' => AppointmentType::from($validated['type']),
                'status' => AppointmentStatus::from($validated['status']),
                'notes' => $validated['notes'] ?? null,
            ]);

            $appointment->load(['patient', 'doctor']);

            event(new AppointmentCreated($appointment));

            return $appointment;
        });
    }

    /**
     * @param  array<string, mixed>  $validated
     */
    public function update(Appointment $appointment, array $validated): Appointment
    {
        return DB::transaction(function () use ($appointment, $validated): Appointment {
            $appointment->update([
                'patient_id' => $validated['patient_id'] ?? $appointment->patient_id,
                'doctor_id' => $validated['doctor_id'] ?? $appointment->doctor_id,
                'appointment_datetime' => $validated['appointment_datetime'] ?? $appointment->appointment_datetime,
                'type' => isset($validated['type']) ? AppointmentType::from($validated['type']) : $appointment->type,
                'status' => isset($validated['status']) ? AppointmentStatus::from($validated['status']) : $appointment->status,
                'notes' => array_key_exists('notes', $validated) ? $validated['notes'] : $appointment->notes,
            ]);

            return $appointment->fresh(['patient', 'doctor']);
        });
    }
}
