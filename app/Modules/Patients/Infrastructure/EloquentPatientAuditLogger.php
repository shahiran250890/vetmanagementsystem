<?php

namespace App\Modules\Patients\Infrastructure;

use App\Models\Patients\PatientHistoryEntry;
use App\Modules\Patients\Contracts\PatientAuditLogger;

class EloquentPatientAuditLogger implements PatientAuditLogger
{
    /**
     * @param  array<string, mixed>  $metadata
     */
    public function record(
        int $patientId,
        string $action,
        ?string $referenceType,
        ?int $referenceId,
        ?string $description,
        array $metadata,
        ?int $createdById,
    ): void {
        PatientHistoryEntry::query()->create([
            'patient_id' => $patientId,
            'reference_type' => $referenceType,
            'reference_id' => $referenceId,
            'action' => $action,
            'description' => $description,
            'metadata' => $metadata === [] ? null : $metadata,
            'created_by' => $createdById,
        ]);
    }
}
