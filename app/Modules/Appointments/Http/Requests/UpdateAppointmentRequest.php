<?php

namespace App\Modules\Appointments\Http\Requests;

use App\Enums\Appointments\AppointmentStatus;
use App\Enums\Appointments\AppointmentType;
use App\Models\Appointments\Appointment;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateAppointmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        $appointment = $this->route('appointment');

        if (! $appointment instanceof Appointment) {
            return false;
        }

        return $this->user()?->can('update', $appointment) ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'patient_id' => ['sometimes', 'integer', 'exists:patients,id'],
            'doctor_id' => ['sometimes', 'integer', 'exists:users,id'],
            'appointment_datetime' => ['sometimes', 'date'],
            'type' => ['sometimes', 'string', Rule::enum(AppointmentType::class)],
            'status' => ['sometimes', 'string', Rule::enum(AppointmentStatus::class)],
            'notes' => ['nullable', 'string', 'max:5000'],
        ];
    }
}
