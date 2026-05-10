<?php

namespace App\Modules\Patients\Http\Resources;

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
        /** @var array<string, mixed> $metadata */
        $metadata = is_array($this->metadata) ? $this->metadata : [];
        $legacyDetails = isset($metadata['details']) ? (string) $metadata['details'] : null;
        $symptoms = isset($metadata['symptoms']) ? (string) $metadata['symptoms'] : null;

        return [
            'id' => $this->id,
            'reference_type' => $this->reference_type,
            'reference_id' => $this->reference_id,
            'action' => $this->action,
            'description' => $this->description,
            'metadata' => $this->metadata,
            'entry_date' => $metadata['entry_date'] ?? null,
            'visit_case_number' => $metadata['visit_case_number'] ?? null,
            'visit_at' => $metadata['visit_at'] ?? null,
            'clinic_location' => $metadata['clinic_location'] ?? null,
            'visit_type' => $metadata['visit_type'] ?? null,
            'visit_status' => $metadata['visit_status'] ?? null,
            'appointment_id' => $metadata['appointment_id'] ?? null,
            'entry_type' => $metadata['entry_type'] ?? null,
            'title' => $metadata['title'] ?? $this->description ?? 'Untitled entry',
            'symptoms' => $symptoms,
            'diagnosis' => $metadata['diagnosis'] ?? null,
            'details' => $legacyDetails,
            'created_at' => $this->created_at?->toIso8601String(),
            'creator' => $this->whenLoaded('creator', fn (): ?array => $this->creator ? [
                'id' => $this->creator->id,
                'name' => $this->creator->name,
            ] : null),
        ];
    }
}
