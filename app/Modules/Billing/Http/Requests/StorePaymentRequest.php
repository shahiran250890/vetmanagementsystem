<?php

namespace App\Modules\Billing\Http\Requests;

use App\Models\Billing\Bill;
use App\Models\Billing\Payment;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StorePaymentRequest extends FormRequest
{
    public function authorize(): bool
    {
        if (! $this->user()?->can('create', Payment::class)) {
            return false;
        }

        $bill = Bill::query()->find((int) $this->input('bill_id'));

        if ($bill === null) {
            return false;
        }

        return $this->user()->can('view', $bill);
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'bill_id' => ['required', 'integer', 'exists:bills,id'],
            'amount' => ['required', 'numeric', 'min:0.01'],
            'method' => ['required', 'string', 'max:64'],
            'paid_at' => ['required', 'date'],
        ];
    }
}
