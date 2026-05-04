<?php

namespace App\Modules\Medical\Listeners;

use App\Models\Medical\MedicalRecord;
use App\Modules\Medical\Events\MedicalRecordCreated;
use App\Modules\Patients\Contracts\PatientAuditLogger;

class RecordMedicalRecordPatientAudit
{
    public function __construct(
        protected PatientAuditLogger $patientAuditLogger,
    ) {}

    public function handle(MedicalRecordCreated $event): void
    {
        $record = $event->medicalRecord->loadMissing('patient', 'doctor');

        $this->patientAuditLogger->record(
            patientId: $record->patient_id,
            action: 'medical_record.created',
            referenceType: MedicalRecord::class,
            referenceId: $record->id,
            description: 'Medical record added',
            metadata: [
                'medical_record_id' => $record->id,
                'doctor_id' => $record->doctor_id,
                'appointment_id' => $record->appointment_id,
            ],
            createdById: null,
        );
    }
}
