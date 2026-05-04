<?php

namespace Database\Factories\Patients;

use App\Models\Patients\BloodType;
use App\Models\Patients\Patient;
use App\Models\Patients\PatientAnimalProfile;
use App\Models\Patients\PatientHumanProfile;
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
            'breed' => fake()->word(),
            'sex' => fake()->randomElement(['Male', 'Female']),
            'date_of_birth' => fake()->dateTimeBetween('-10 years', '-6 months')->format('Y-m-d'),
            'color' => fake()->safeColorName(),
            'microchip_number' => fake()->optional()->bothify('MC-########'),
            'emergency_contact_name' => fake()->optional()->name(),
            'emergency_contact_phone' => fake()->optional()->phoneNumber(),
            'allergies' => fake()->optional()->sentence(),
            'current_medications' => fake()->optional()->sentence(),
            'vaccination_status' => fake()->optional()->randomElement(['up_to_date', 'overdue', 'unknown']),
            'status' => 'active',
            'notes' => fake()->optional()->paragraph(),
        ];
    }

    public function configure(): static
    {
        return $this->afterCreating(function (Patient $patient): void {
            if ($patient->patient_type !== 'animal') {
                return;
            }

            if ($patient->animalProfile()->exists()) {
                return;
            }

            PatientAnimalProfile::query()->create([
                'patient_id' => $patient->id,
                'owner_user_id' => $patient->user_id,
                'species' => fake()->randomElement(['Canine', 'Feline']),
                'breed' => $patient->breed,
                'color' => $patient->color,
                'microchip_number' => $patient->microchip_number,
                'latest_weight_kg' => fake()->optional()->randomFloat(2, 1, 80),
                'vaccination_status' => $patient->vaccination_status,
            ]);
        });
    }

    /**
     * Human patient with a linked {@see PatientHumanProfile} (requires blood types seeded).
     */
    public function human(): static
    {
        return $this->state(fn (): array => [
            'patient_type' => 'human',
            'breed' => null,
            'color' => null,
            'microchip_number' => null,
            'vaccination_status' => null,
        ])->afterCreating(function (Patient $patient): void {
            if ($patient->patient_type !== 'human') {
                return;
            }

            if ($patient->humanProfile()->exists()) {
                return;
            }

            $bloodTypeId = BloodType::query()->inRandomOrder()->value('id');

            PatientHumanProfile::query()->create([
                'patient_id' => $patient->id,
                'identification_number' => fake()->optional()->numerify('##########'),
                'blood_type_id' => $bloodTypeId,
                'primary_phone' => fake()->phoneNumber(),
                'address' => fake()->streetAddress().', '.fake()->city(),
                'height_cm' => fake()->optional()->randomFloat(2, 150, 195),
                'weight_kg' => fake()->optional()->randomFloat(2, 45, 120),
                'blood_pressure' => fake()->optional()->regexify('[1-9][0-9]{2}\/[0-9]{2,3}'),
                'vital_medical_information' => fake()->optional()->sentence(),
            ]);
        });
    }
}
