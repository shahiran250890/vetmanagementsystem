<?php

namespace App\Modules\Billing\Http\Requests;

use App\Enums\Billing\BillStatus;
use App\Models\Billing\Bill;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreBillRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', Bill::class) ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'patient_id' => ['required', 'integer', 'exists:patients,id'],
            'status' => ['nullable', 'string', Rule::enum(BillStatus::class)],
            'items' => ['nullable', 'array'],
            'items.*.item_type' => ['required_with:items', 'string', 'max:64'],
            'items.*.description' => ['nullable', 'string', 'max:500'],
            'items.*.amount' => ['required_with:items', 'numeric', 'min:0'],
        ];
    }
}
