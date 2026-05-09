<?php

namespace App\Modules\Medical\Listeners;

use App\Models\Medical\MedicalCertificate;
use App\Modules\Medical\Events\MedicalCertificateIssued;
use App\Modules\Patients\Contracts\PatientAuditLogger;

class RecordMedicalCertificateIssuedPatientAudit
{
    public function __construct(
        protected PatientAuditLogger $patientAuditLogger,
    ) {}

    public function handle(MedicalCertificateIssued $event): void
    {
        $certificate = $event->medicalCertificate->loadMissing('patient', 'doctor');

        $this->patientAuditLogger->record(
            patientId: $certificate->patient_id,
            action: 'medical_certificate.issued',
            referenceType: MedicalCertificate::class,
            referenceId: $certificate->id,
            description: 'Medical certificate (MC) issued',
            metadata: [
                'medical_certificate_id' => $certificate->id,
                'certificate_number' => $certificate->certificate_number,
                'doctor_id' => $certificate->doctor_id,
                'unfit_from' => $certificate->unfit_from?->toDateString(),
                'unfit_to' => $certificate->unfit_to?->toDateString(),
            ],
            createdById: null,
        );
    }
}
