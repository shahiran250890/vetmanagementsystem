<?php

namespace App\Modules\Patients\Http\Resources;

use App\Models\Patients\Patient;
use App\Modules\Medical\Http\Resources\MedicalCertificateResource;
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
            'species' => $this->animalProfile?->species,
            'breed' => $this->animalProfile?->breed ?? $this->breed,
            'color' => $this->animalProfile?->color ?? $this->color,
            'microchip_number' => $this->animalProfile?->microchip_number ?? $this->microchip_number,
            'latest_weight_kg' => $this->animalProfile?->latest_weight_kg,
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
                'blood_type' => $this->humanProfile->blood_type,
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
            'appointments' => $this->whenLoaded(
                'appointments',
                fn (): array => $this->appointments->map(fn ($appointment): array => [
                    'id' => $appointment->id,
                    'doctor_id' => $appointment->doctor_id,
                    'appointment_datetime' => $appointment->appointment_datetime?->toIso8601String(),
                    'type' => $appointment->type?->value,
                    'status' => $appointment->status?->value,
                ])->all(),
                [],
            ),
            'medical_records' => $this->whenLoaded(
                'medicalRecords',
                fn (): array => $this->medicalRecords->map(fn ($record): array => [
                    'id' => $record->id,
                    'doctor_id' => $record->doctor_id,
                    'appointment_id' => $record->appointment_id,
                    'diagnosis' => $record->diagnosis,
                ])->all(),
                [],
            ),
            'medical_certificates' => $this->whenLoaded(
                'medicalCertificates',
                fn (): array => MedicalCertificateResource::collection($this->medicalCertificates)
                    ->resolve(),
                [],
            ),
            'bills' => $this->whenLoaded(
                'bills',
                fn (): array => $this->bills->map(fn ($bill): array => [
                    'id' => $bill->id,
                    'total_amount' => $bill->total_amount,
                    'status' => $bill->status?->value ?? (string) $bill->status,
                ])->all(),
                [],
            ),
            'vitals' => $this->whenLoaded(
                'vitals',
                fn (): array => $this->vitals->map(fn ($vital): array => [
                    'id' => $vital->id,
                    'weight_kg' => $vital->weight_kg,
                    'height_cm' => $vital->height_cm,
                    'temperature' => $vital->temperature,
                    'recorded_at' => $vital->recorded_at?->toIso8601String(),
                ])->all(),
                [],
            ),
        ];
    }
}
