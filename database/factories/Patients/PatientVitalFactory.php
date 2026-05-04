<?php

namespace Database\Factories\Patients;

use App\Models\Patients\Patient;
use App\Models\Patients\PatientVital;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PatientVital>
 */
class PatientVitalFactory extends Factory
{
    protected $model = PatientVital::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'patient_id' => Patient::factory(),
            'weight_kg' => fake()->optional()->randomFloat(2, 2, 120),
            'height_cm' => fake()->optional()->randomFloat(2, 50, 220),
            'temperature' => fake()->optional()->randomFloat(2, 36, 40),
            'recorded_at' => fake()->dateTimeBetween('-1 year'),
        ];
    }
}
