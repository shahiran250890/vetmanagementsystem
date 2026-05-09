<?php

namespace App\Modules\Medical\Listeners;

use App\Models\Medical\MedicalCertificate;
use App\Modules\Medical\Events\MedicalCertificateVoided;
use App\Modules\Patients\Contracts\PatientAuditLogger;

class RecordMedicalCertificateVoidedPatientAudit
{
    public function __construct(
        protected PatientAuditLogger $patientAuditLogger,
    ) {}

    public function handle(MedicalCertificateVoided $event): void
    {
        $certificate = $event->medicalCertificate->loadMissing('patient');

        $this->patientAuditLogger->record(
            patientId: $certificate->patient_id,
            action: 'medical_certificate.voided',
            referenceType: MedicalCertificate::class,
            referenceId: $certificate->id,
            description: 'Medical certificate voided',
            metadata: [
                'medical_certificate_id' => $certificate->id,
                'certificate_number' => $certificate->certificate_number,
                'void_reason' => $certificate->void_reason,
            ],
            createdById: $event->voidedByUserId,
        );
    }
}
