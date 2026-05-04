<?php

namespace App\Modules\Billing\Http\Requests;

use App\Enums\Billing\BillStatus;
use App\Models\Billing\Bill;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateBillRequest extends FormRequest
{
    public function authorize(): bool
    {
        $bill = $this->route('bill');

        if (! $bill instanceof Bill) {
            return false;
        }

        return $this->user()?->can('update', $bill) ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'patient_id' => ['sometimes', 'integer', 'exists:patients,id'],
            'status' => ['sometimes', 'string', Rule::enum(BillStatus::class)],
        ];
    }
}
