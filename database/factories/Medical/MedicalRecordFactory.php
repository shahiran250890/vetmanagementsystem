<?php

namespace Database\Factories\Medical;

use App\Models\Appointments\Appointment;
use App\Models\Medical\MedicalRecord;
use App\Models\Patients\Patient;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MedicalRecord>
 */
class MedicalRecordFactory extends Factory
{
    protected $model = MedicalRecord::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'patient_id' => Patient::factory(),
            'doctor_id' => User::factory(),
            'appointment_id' => null,
            'symptoms' => fake()->optional()->paragraph(),
            'diagnosis' => fake()->optional()->sentence(),
            'treatment' => fake()->optional()->paragraph(),
            'notes' => fake()->optional()->sentence(),
        ];
    }

    public function forAppointment(Appointment $appointment): static
    {
        return $this->state(fn (): array => [
            'patient_id' => $appointment->patient_id,
            'doctor_id' => $appointment->doctor_id,
            'appointment_id' => $appointment->id,
        ]);
    }
}
