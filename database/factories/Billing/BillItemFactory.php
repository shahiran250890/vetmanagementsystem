<?php

namespace Database\Factories\Billing;

use App\Models\Billing\Bill;
use App\Models\Billing\BillItem;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<BillItem>
 */
class BillItemFactory extends Factory
{
    protected $model = BillItem::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'bill_id' => Bill::factory(),
            'item_type' => fake()->randomElement(['consultation', 'lab', 'procedure', 'medicine']),
            'description' => fake()->sentence(),
            'amount' => fake()->randomFloat(2, 10, 200),
        ];
    }
}
