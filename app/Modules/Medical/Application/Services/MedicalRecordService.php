<?php

namespace App\Modules\Medical\Application\Services;

use App\Models\Medical\MedicalRecord;
use App\Models\Medical\Prescription;
use App\Modules\Medical\Events\MedicalRecordCreated;
use Illuminate\Support\Facades\DB;

class MedicalRecordService
{
    /**
     * @param  array<string, mixed>  $validated
     */
    public function create(array $validated): MedicalRecord
    {
        return DB::transaction(function () use ($validated): MedicalRecord {
            $record = MedicalRecord::query()->create([
                'patient_id' => $validated['patient_id'],
                'doctor_id' => $validated['doctor_id'],
                'appointment_id' => $validated['appointment_id'] ?? null,
                'symptoms' => $validated['symptoms'] ?? null,
                'diagnosis' => $validated['diagnosis'] ?? null,
                'treatment' => $validated['treatment'] ?? null,
                'notes' => $validated['notes'] ?? null,
            ]);

            foreach ($validated['prescriptions'] ?? [] as $prescription) {
                if (! is_array($prescription) || ! isset($prescription['medicine_name'])) {
                    continue;
                }

                Prescription::query()->create([
                    'medical_record_id' => $record->id,
                    'medicine_name' => $prescription['medicine_name'],
                    'dosage' => $prescription['dosage'] ?? null,
                    'duration' => $prescription['duration'] ?? null,
                    'instructions' => $prescription['instructions'] ?? null,
                ]);
            }

            $record->load(['patient', 'doctor', 'appointment', 'prescriptions']);

            event(new MedicalRecordCreated($record));

            return $record;
        });
    }

    /**
     * @param  array<string, mixed>  $validated
     */
    public function update(MedicalRecord $medicalRecord, array $validated): MedicalRecord
    {
        return DB::transaction(function () use ($medicalRecord, $validated): MedicalRecord {
            $medicalRecord->update([
                'patient_id' => $validated['patient_id'] ?? $medicalRecord->patient_id,
                'doctor_id' => $validated['doctor_id'] ?? $medicalRecord->doctor_id,
                'appointment_id' => array_key_exists('appointment_id', $validated) ? $validated['appointment_id'] : $medicalRecord->appointment_id,
                'symptoms' => array_key_exists('symptoms', $validated) ? $validated['symptoms'] : $medicalRecord->symptoms,
                'diagnosis' => array_key_exists('diagnosis', $validated) ? $validated['diagnosis'] : $medicalRecord->diagnosis,
                'treatment' => array_key_exists('treatment', $validated) ? $validated['treatment'] : $medicalRecord->treatment,
                'notes' => array_key_exists('notes', $validated) ? $validated['notes'] : $medicalRecord->notes,
            ]);

            return $medicalRecord->fresh(['patient', 'doctor', 'appointment', 'prescriptions']);
        });
    }
}
