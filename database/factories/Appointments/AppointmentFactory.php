<?php

namespace Database\Factories\Appointments;

use App\Enums\Appointments\AppointmentStatus;
use App\Enums\Appointments\AppointmentType;
use App\Models\Appointments\Appointment;
use App\Models\Patients\Patient;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Appointment>
 */
class AppointmentFactory extends Factory
{
    protected $model = Appointment::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'patient_id' => Patient::factory(),
            'doctor_id' => User::factory(),
            'appointment_datetime' => fake()->dateTimeBetween('now', '+30 days'),
            'type' => fake()->randomElement(AppointmentType::cases())->value,
            'status' => AppointmentStatus::Pending->value,
            'notes' => fake()->optional()->sentence(),
        ];
    }
}
