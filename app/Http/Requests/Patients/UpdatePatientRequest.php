<?php

namespace App\Http\Requests\Patients;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePatientRequest extends FormRequest
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
        $patient = $this->route('patient');

        return [
            'user_id' => ['nullable', 'integer', 'exists:users,id'],
            'name' => ['required', 'string', 'max:255'],
            'species' => ['required', 'string', 'max:255'],
            'breed' => ['nullable', 'string', 'max:255'],
            'sex' => ['nullable', 'string', 'max:50'],
            'date_of_birth' => ['nullable', 'date', 'before_or_equal:today'],
            'color' => ['nullable', 'string', 'max:255'],
            'microchip_number' => ['nullable', 'string', 'max:255', Rule::unique('patients', 'microchip_number')->ignore($patient?->id)],
            'emergency_contact_name' => ['nullable', 'string', 'max:255'],
            'emergency_contact_phone' => ['nullable', 'string', 'max:50'],
            'allergies' => ['nullable', 'string'],
            'current_medications' => ['nullable', 'string'],
            'latest_weight_kg' => ['nullable', 'numeric', 'min:0', 'max:999.99'],
            'vaccination_status' => ['nullable', 'string', 'max:255'],
            'status' => ['required', Rule::in(['active', 'deceased', 'transferred'])],
            'notes' => ['nullable', 'string'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Please provide the patient name.',
            'species.required' => 'Please provide the species.',
            'status.required' => 'Please choose a patient status.',
            'status.in' => 'Patient status must be active, deceased, or transferred.',
        ];
    }
}
