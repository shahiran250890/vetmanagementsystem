<?php

namespace App\Modules\Medical\Http\Resources;

use App\Models\Medical\MedicalRecord;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin MedicalRecord */
class MedicalRecordResource extends JsonResource
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
            'appointment_id' => $this->appointment_id,
            'symptoms' => $this->symptoms,
            'diagnosis' => $this->diagnosis,
            'treatment' => $this->treatment,
            'notes' => $this->notes,
            'patient' => $this->whenLoaded('patient', fn (): array => [
                'id' => $this->patient->id,
                'name' => $this->patient->name,
            ]),
            'doctor' => $this->whenLoaded('doctor', fn (): array => [
                'id' => $this->doctor->id,
                'name' => $this->doctor->name,
            ]),
            'prescriptions' => $this->whenLoaded(
                'prescriptions',
                fn () => PrescriptionResource::collection($this->prescriptions)->resolve(),
                [],
            ),
        ];
    }
}
