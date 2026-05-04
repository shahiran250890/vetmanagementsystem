<?php

namespace App\Modules\Patients\Application\Services;

use App\Models\Patients\Patient;
use App\Models\Patients\PatientHistoryEntry;

class PatientHistoryService
{
    /**
     * @param  array<string, mixed>  $validated
     */
    public function create(Patient $patient, array $validated, int $createdBy): PatientHistoryEntry
    {
        return $patient->historyEntries()->create([
            'action' => 'manual.visit_log',
            'description' => $validated['title'] ?? null,
            'metadata' => [
                'title' => $validated['title'] ?? null,
                'details' => $validated['details'] ?? null,
                'entry_date' => $validated['entry_date'] ?? null,
                'visit_at' => $validated['visit_at'] ?? null,
                'clinic_location' => $validated['clinic_location'] ?? null,
                'veterinarian_user_id' => $validated['veterinarian_user_id'] ?? null,
                'assistant_user_id' => $validated['assistant_user_id'] ?? null,
                'visit_type' => $validated['visit_type'] ?? null,
                'appointment_id' => $validated['appointment_id'] ?? null,
                'visit_status' => $validated['visit_status'] ?? null,
                'entry_type' => $validated['entry_type'] ?? null,
            ],
            'created_by' => $createdBy,
        ]);
    }
}
