<?php

namespace Database\Factories;

use App\Models\Staff;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Staff>
 */
class StaffFactory extends Factory
{
    protected $model = Staff::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->name();

        return [
            'staff_number' => 'STF-'.str_pad((string) fake()->unique()->numberBetween(1, 99999), 5, '0', STR_PAD_LEFT),
            'full_name' => $name,
            'preferred_name' => null,
            'nric_passport' => null,
            'gender' => null,
            'date_of_birth' => null,
            'nationality' => null,
            'marital_status' => null,
            'photo_path' => null,
            'mobile_number' => fake()->optional()->phoneNumber(),
            'alternate_phone' => null,
            'email' => fake()->unique()->safeEmail(),
            'address_line_1' => null,
            'address_line_2' => null,
            'city' => null,
            'state' => null,
            'postcode' => null,
            'country' => null,
            'emergency_contact_name' => null,
            'emergency_contact_phone' => null,
            'employee_number' => null,
            'hire_date' => null,
            'confirmation_date' => null,
            'position' => fake()->optional()->jobTitle(),
            'department' => null,
            'reporting_manager_id' => null,
            'employment_type' => null,
            'salary_type' => null,
            'assigned_clinics' => null,
            'working_hours' => null,
            'employment_status' => 'active',
            'is_active' => true,
            'medical_registration_number' => null,
            'apc_number' => null,
            'apc_expiry_date' => null,
            'specialization' => null,
            'qualifications' => null,
            'years_experience' => null,
            'documents' => null,
        ];
    }
}
