<?php

namespace Database\Factories\Medical;

use App\Models\Medical\MedicalRecord;
use App\Models\Medical\Prescription;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Prescription>
 */
class PrescriptionFactory extends Factory
{
    protected $model = Prescription::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'medical_record_id' => MedicalRecord::factory(),
            'medicine_name' => fake()->words(3, true),
            'dosage' => fake()->optional()->randomElement(['10mg', '1 tablet', '5ml']),
            'duration' => fake()->optional()->randomElement(['7 days', '14 days', '1 month']),
            'instructions' => fake()->optional()->sentence(),
        ];
    }
}
