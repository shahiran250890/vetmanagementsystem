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
            'reference_type' => null,
            'reference_id' => null,
            'action' => 'manual.visit_log',
            'description' => fake()->sentence(4),
            'metadata' => [
                'title' => fake()->sentence(4),
                'details' => fake()->paragraph(),
            ],
        ];
    }
}
