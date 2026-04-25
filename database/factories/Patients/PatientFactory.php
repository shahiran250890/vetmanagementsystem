<?php

namespace Database\Factories\Patients;

use App\Models\Patients\Patient;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Patient>
 */
class PatientFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'patient_type' => 'animal',
            'user_id' => User::factory(),
            'name' => fake()->firstName(),
            'species' => fake()->randomElement(['Canine', 'Feline']),
            'breed' => fake()->word(),
            'sex' => fake()->randomElement(['Male', 'Female']),
            'date_of_birth' => fake()->dateTimeBetween('-10 years', '-6 months')->format('Y-m-d'),
            'color' => fake()->safeColorName(),
            'microchip_number' => fake()->optional()->bothify('MC-########'),
            'emergency_contact_name' => fake()->optional()->name(),
            'emergency_contact_phone' => fake()->optional()->phoneNumber(),
            'allergies' => fake()->optional()->sentence(),
            'current_medications' => fake()->optional()->sentence(),
            'latest_weight_kg' => fake()->optional()->randomFloat(2, 1, 80),
            'vaccination_status' => fake()->optional()->randomElement(['up_to_date', 'overdue', 'unknown']),
            'status' => 'active',
            'notes' => fake()->optional()->paragraph(),
        ];
    }
}
