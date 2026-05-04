<?php

namespace App\Modules\Billing\Http\Resources;

use App\Models\Billing\Bill;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Bill */
class BillResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'patient_id' => $this->patient_id,
            'total_amount' => $this->total_amount,
            'status' => $this->status?->value ?? (string) $this->status,
            'patient' => $this->whenLoaded('patient', fn (): array => [
                'id' => $this->patient->id,
                'name' => $this->patient->name,
            ]),
            'items' => $this->whenLoaded(
                'items',
                fn () => BillItemResource::collection($this->items)->resolve(),
                [],
            ),
            'payments' => $this->whenLoaded(
                'payments',
                fn () => PaymentResource::collection($this->payments)->resolve(),
                [],
            ),
        ];
    }
}
