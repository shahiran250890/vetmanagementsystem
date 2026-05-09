<?php

namespace App\Modules\Medical\Application\Services;

use App\Enums\Medical\MedicalCertificateStatus;
use App\Models\Medical\MedicalCertificate;
use App\Models\Patients\Patient;
use App\Models\User;
use App\Modules\Medical\Events\MedicalCertificateIssued;
use App\Modules\Medical\Events\MedicalCertificateVoided;
use Illuminate\Support\Facades\DB;

class MedicalCertificateService
{
    /**
     * @param  array<string, mixed>  $validated
     */
    public function issue(Patient $patient, User $issuer, array $validated): MedicalCertificate
    {
        return DB::transaction(function () use ($patient, $issuer, $validated): MedicalCertificate {
            $certificate = MedicalCertificate::query()->create([
                'patient_id' => $patient->id,
                'medical_record_id' => $validated['medical_record_id'] ?? null,
                'doctor_id' => $issuer->id,
                'employer_name' => $validated['employer_name'] ?? null,
                'unfit_from' => $validated['unfit_from'],
                'unfit_to' => $validated['unfit_to'],
                'remarks' => $validated['remarks'] ?? null,
                'status' => MedicalCertificateStatus::Issued,
                'issued_at' => now(),
                'certificate_number' => null,
            ]);

            $certificate->update([
                'certificate_number' => sprintf(
                    'MC-%s-%06d',
                    $certificate->issued_at?->format('Y') ?? now()->format('Y'),
                    $certificate->id,
                ),
            ]);

            $certificate->refresh();

            event(new MedicalCertificateIssued($certificate));

            return $certificate;
        });
    }

    public function void(MedicalCertificate $certificate, User $actor, string $voidReason): MedicalCertificate
    {
        return DB::transaction(function () use ($certificate, $actor, $voidReason): MedicalCertificate {
            if ($certificate->isVoided()) {
                return $certificate;
            }

            $certificate->update([
                'status' => MedicalCertificateStatus::Voided,
                'voided_at' => now(),
                'void_reason' => $voidReason,
            ]);

            $certificate->refresh();

            event(new MedicalCertificateVoided($certificate, $actor->id));

            return $certificate;
        });
    }
}
