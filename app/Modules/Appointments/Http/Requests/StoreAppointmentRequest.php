<?php

namespace App\Modules\Appointments\Http\Requests;

use App\Enums\Appointments\AppointmentStatus;
use App\Enums\Appointments\AppointmentType;
use App\Models\Appointments\Appointment;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAppointmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', Appointment::class) ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'patient_id' => ['required', 'integer', 'exists:patients,id'],
            'doctor_id' => ['required', 'integer', 'exists:users,id'],
            'appointment_datetime' => ['required', 'date'],
            'type' => ['required', 'string', Rule::enum(AppointmentType::class)],
            'status' => ['required', 'string', Rule::enum(AppointmentStatus::class)],
            'notes' => ['nullable', 'string', 'max:5000'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'patient_id.required' => 'Select a patient for this appointment.',
            'doctor_id.required' => 'Select a doctor for this appointment.',
        ];
    }
}
