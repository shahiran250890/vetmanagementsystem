<?php

namespace App\Http\Requests\Patients;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StorePatientHistoryEntryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'entry_date' => ['required', 'date'],
            'visit_case_number' => ['nullable', 'string', 'max:255'],
            'visit_at' => ['required', 'date'],
            'clinic_location' => ['required', 'string', 'max:255'],
            'veterinarian_user_id' => ['nullable', 'integer', 'exists:users,id'],
            'assistant_user_id' => ['nullable', 'integer', 'exists:users,id'],
            'visit_type' => ['required', 'string', 'max:255'],
            'appointment_id' => ['nullable', 'string', 'max:255'],
            'visit_status' => ['required', 'string', 'in:waiting,in_progress,completed,cancelled'],
            'entry_type' => ['nullable', 'string', 'max:255'],
            'title' => ['required', 'string', 'max:255'],
            'details' => ['required', 'string'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'entry_date.required' => 'Please provide an entry date.',
            'visit_at.required' => 'Please provide visit date and time.',
            'clinic_location.required' => 'Please provide clinic location.',
            'visit_type.required' => 'Please provide visit type.',
            'visit_status.required' => 'Please provide visit status.',
            'title.required' => 'Please provide a title for this history entry.',
            'details.required' => 'Please provide clinical details.',
        ];
    }
}
