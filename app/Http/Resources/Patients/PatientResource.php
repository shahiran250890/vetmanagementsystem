<?php

namespace App\Http\Resources\Patients;

use App\Models\Patients\Patient;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Patient */
class PatientResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'patient_type' => $this->patient_type,
            'name' => $this->name,
            'sex' => $this->sex,
            'date_of_birth' => $this->date_of_birth?->toDateString(),
            'emergency_contact_name' => $this->emergency_contact_name,
            'emergency_contact_phone' => $this->emergency_contact_phone,
            'allergies' => $this->allergies,
            'current_medications' => $this->current_medications,
            'status' => $this->status,
            'notes' => $this->notes,
            'species' => $this->animalProfile?->species ?? $this->species,
            'breed' => $this->animalProfile?->breed ?? $this->breed,
            'color' => $this->animalProfile?->color ?? $this->color,
            'microchip_number' => $this->animalProfile?->microchip_number ?? $this->microchip_number,
            'latest_weight_kg' => $this->animalProfile?->latest_weight_kg ?? $this->latest_weight_kg,
            'vaccination_status' => $this->animalProfile?->vaccination_status ?? $this->vaccination_status,
            'user_id' => $this->animalProfile?->owner_user_id ?? $this->user_id,
            'user' => $this->whenLoaded('user', fn (): ?array => $this->user ? [
                'id' => $this->user->id,
                'name' => $this->user->name,
            ] : null),
            'animal_profile' => $this->whenLoaded('animalProfile', fn (): ?array => $this->animalProfile ? [
                'owner_user_id' => $this->animalProfile->owner_user_id,
                'species' => $this->animalProfile->species,
                'breed' => $this->animalProfile->breed,
                'color' => $this->animalProfile->color,
                'microchip_number' => $this->animalProfile->microchip_number,
                'latest_weight_kg' => $this->animalProfile->latest_weight_kg,
                'vaccination_status' => $this->animalProfile->vaccination_status,
            ] : null),
            'human_profile' => $this->whenLoaded('humanProfile', fn (): ?array => $this->humanProfile ? [
                'identification_number' => $this->humanProfile->identification_number,
                'blood_type_id' => $this->humanProfile->blood_type_id,
                'blood_type' => $this->humanProfile->bloodType?->name ?? $this->humanProfile->blood_type,
                'primary_phone' => $this->humanProfile->primary_phone,
                'address' => $this->humanProfile->address,
                'height_cm' => $this->humanProfile->height_cm,
                'weight_kg' => $this->humanProfile->weight_kg,
                'blood_pressure' => $this->humanProfile->blood_pressure,
                'vital_medical_information' => $this->humanProfile->vital_medical_information,
            ] : null),
            'history_entries' => $this->whenLoaded(
                'historyEntries',
                fn (): array => PatientHistoryEntryResource::collection($this->historyEntries)
                    ->resolve(),
                [],
            ),
        ];
    }
}
