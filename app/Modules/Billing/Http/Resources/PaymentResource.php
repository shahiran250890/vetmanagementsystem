<?php

namespace App\Modules\Billing\Http\Resources;

use App\Models\Billing\Payment;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Payment */
class PaymentResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'bill_id' => $this->bill_id,
            'amount' => $this->amount,
            'method' => $this->method,
            'paid_at' => $this->paid_at?->toIso8601String(),
        ];
    }
}
