<?php

namespace App\Modules\Appointments\Http\Resources;

use App\Models\Appointments\Appointment;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Appointment */
class AppointmentResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'patient_id' => $this->patient_id,
            'doctor_id' => $this->doctor_id,
            'appointment_datetime' => $this->appointment_datetime?->toIso8601String(),
            'type' => $this->type?->value,
            'status' => $this->status?->value,
            'notes' => $this->notes,
            'patient' => $this->whenLoaded('patient', fn (): array => [
                'id' => $this->patient->id,
                'name' => $this->patient->name,
            ]),
            'doctor' => $this->whenLoaded('doctor', fn (): array => [
                'id' => $this->doctor->id,
                'name' => $this->doctor->name,
            ]),
        ];
    }
}
