<?php

namespace App\Modules\Patients\Contracts;

interface PatientAuditLogger
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
    ): void;
}
