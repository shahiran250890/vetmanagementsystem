<?php

namespace Database\Factories\Billing;

use App\Models\Billing\Bill;
use App\Models\Billing\Payment;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Payment>
 */
class PaymentFactory extends Factory
{
    protected $model = Payment::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'bill_id' => Bill::factory(),
            'amount' => fake()->randomFloat(2, 10, 300),
            'method' => fake()->randomElement(['cash', 'card', 'transfer']),
            'paid_at' => now(),
        ];
    }
}
