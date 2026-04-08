<?php

namespace Database\Factories\Patients;

use App\Models\Patients\Patient;
use App\Models\Patients\PatientHistoryEntry;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PatientHistoryEntry>
 */
class PatientHistoryEntryFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'patient_id' => Patient::factory(),
            'created_by' => User::factory(),
            'visit_case_number' => fake()->optional()->bothify('CASE-######'),
            'entry_date' => fake()->dateTimeBetween('-2 years')->format('Y-m-d'),
            'visit_at' => fake()->dateTimeBetween('-2 years'),
            'clinic_location' => fake()->randomElement(['Main Branch', 'North Branch', 'South Branch']),
            'veterinarian_user_id' => User::factory(),
            'assistant_user_id' => User::factory(),
            'visit_type' => fake()->randomElement(['consultation', 'vaccination', 'surgery', 'emergency', 'grooming_medical_check', 'follow_up']),
            'appointment_id' => fake()->optional()->bothify('APT-######'),
            'visit_status' => fake()->randomElement(['waiting', 'in_progress', 'completed', 'cancelled']),
            'entry_type' => fake()->randomElement(['consultation', 'vaccination', 'procedure']),
            'title' => fake()->sentence(4),
            'details' => fake()->paragraph(),
        ];
    }
}
