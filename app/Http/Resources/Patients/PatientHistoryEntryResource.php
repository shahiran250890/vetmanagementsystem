<?php

namespace App\Http\Resources\Patients;

use App\Models\Patients\PatientHistoryEntry;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin PatientHistoryEntry */
class PatientHistoryEntryResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'entry_date' => $this->entry_date?->toDateString(),
            'visit_case_number' => $this->visit_case_number,
            'visit_at' => $this->visit_at?->format('Y-m-d H:i:s'),
            'clinic_location' => $this->clinic_location,
            'veterinarian_user_id' => $this->veterinarian_user_id,
            'assistant_user_id' => $this->assistant_user_id,
            'visit_type' => $this->visit_type,
            'appointment_id' => $this->appointment_id,
            'visit_status' => $this->visit_status,
            'entry_type' => $this->entry_type,
            'title' => $this->title,
            'details' => $this->details,
            'creator' => $this->whenLoaded('creator', fn (): ?array => $this->creator ? [
                'id' => $this->creator->id,
                'name' => $this->creator->name,
            ] : null),
        ];
    }
}
