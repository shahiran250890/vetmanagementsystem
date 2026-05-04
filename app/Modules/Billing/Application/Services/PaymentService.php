<?php

namespace App\Modules\Billing\Application\Services;

use App\Enums\Billing\BillStatus;
use App\Models\Billing\Bill;
use App\Models\Billing\Payment;
use App\Modules\Billing\Events\PaymentReceived;
use Illuminate\Support\Facades\DB;

class PaymentService
{
    /**
     * @param  array<string, mixed>  $validated
     */
    public function create(Bill $bill, array $validated): Payment
    {
        return DB::transaction(function () use ($bill, $validated): Payment {
            $payment = $bill->payments()->create([
                'amount' => $validated['amount'],
                'method' => $validated['method'],
                'paid_at' => $validated['paid_at'],
            ]);

            $bill->refresh();

            $paidTotal = (float) $bill->payments()->sum('amount');

            if ($paidTotal >= (float) $bill->total_amount && $bill->total_amount > 0) {
                $bill->update(['status' => BillStatus::Paid]);
            }

            $payment->load('bill.patient');

            event(new PaymentReceived($payment));

            return $payment;
        });
    }
}
