<?php

namespace App\Modules\Billing\Application\Services;

use App\Enums\Billing\BillStatus;
use App\Models\Billing\Bill;
use App\Modules\Billing\Events\BillGenerated;
use Illuminate\Support\Facades\DB;

class BillService
{
    /**
     * @param  array<string, mixed>  $validated
     */
    public function create(array $validated): Bill
    {
        return DB::transaction(function () use ($validated): Bill {
            $bill = Bill::query()->create([
                'patient_id' => $validated['patient_id'],
                'total_amount' => 0,
                'status' => BillStatus::from($validated['status'] ?? BillStatus::Unpaid->value),
            ]);

            $total = 0;

            foreach ($validated['items'] ?? [] as $item) {
                $amount = (float) $item['amount'];
                $total += $amount;

                $bill->items()->create([
                    'item_type' => $item['item_type'],
                    'description' => $item['description'] ?? null,
                    'amount' => $amount,
                ]);
            }

            $bill->update(['total_amount' => $total]);

            $bill = $bill->fresh(['items', 'patient', 'payments']);

            event(new BillGenerated($bill));

            return $bill;
        });
    }

    /**
     * @param  array<string, mixed>  $validated
     */
    public function update(Bill $bill, array $validated): Bill
    {
        return DB::transaction(function () use ($bill, $validated): Bill {
            if (isset($validated['status'])) {
                $bill->status = BillStatus::from($validated['status']);
            }

            if (isset($validated['patient_id'])) {
                $bill->patient_id = $validated['patient_id'];
            }

            $bill->save();

            return $bill->fresh(['items', 'patient', 'payments']);
        });
    }
}
