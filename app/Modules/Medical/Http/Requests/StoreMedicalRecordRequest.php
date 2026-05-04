<?php

namespace App\Modules\Medical\Http\Requests;

use App\Models\Medical\MedicalRecord;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreMedicalRecordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', MedicalRecord::class) ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'patient_id' => ['required', 'integer', 'exists:patients,id'],
            'doctor_id' => ['required', 'integer', 'exists:users,id'],
            'appointment_id' => ['nullable', 'integer', 'exists:appointments,id'],
            'symptoms' => ['nullable', 'string', 'max:10000'],
            'diagnosis' => ['nullable', 'string', 'max:10000'],
            'treatment' => ['nullable', 'string', 'max:10000'],
            'notes' => ['nullable', 'string', 'max:10000'],
            'prescriptions' => ['nullable', 'array'],
            'prescriptions.*.medicine_name' => ['required_with:prescriptions', 'string', 'max:255'],
            'prescriptions.*.dosage' => ['nullable', 'string', 'max:255'],
            'prescriptions.*.duration' => ['nullable', 'string', 'max:255'],
            'prescriptions.*.instructions' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
