<?php

namespace App\Modules\Medical\Http\Resources;

use App\Models\Medical\MedicalCertificate;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin MedicalCertificate */
class MedicalCertificateResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $user = $request->user();

        return [
            'id' => $this->id,
            'patient_id' => $this->patient_id,
            'medical_record_id' => $this->medical_record_id,
            'doctor_id' => $this->doctor_id,
            'certificate_number' => $this->certificate_number,
            'employer_name' => $this->employer_name,
            'unfit_from' => $this->unfit_from?->toDateString(),
            'unfit_to' => $this->unfit_to?->toDateString(),
            'remarks' => $this->remarks,
            'status' => $this->status?->value,
            'issued_at' => $this->issued_at?->toIso8601String(),
            'voided_at' => $this->voided_at?->toIso8601String(),
            'void_reason' => $this->void_reason,
            'doctor' => $this->whenLoaded('doctor', fn (): array => [
                'id' => $this->doctor->id,
                'name' => $this->doctor->name,
                'mmc_registration_number' => $this->doctor->mmc_registration_number,
            ]),
            'can_void' => $user !== null && $user->can('void', $this->resource),
        ];
    }
}
