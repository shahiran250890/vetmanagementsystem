<?php

namespace Database\Factories\Billing;

use App\Enums\Billing\BillStatus;
use App\Models\Billing\Bill;
use App\Models\Patients\Patient;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Bill>
 */
class BillFactory extends Factory
{
    protected $model = Bill::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'patient_id' => Patient::factory(),
            'total_amount' => fake()->randomFloat(2, 20, 500),
            'status' => BillStatus::Unpaid->value,
        ];
    }
}
