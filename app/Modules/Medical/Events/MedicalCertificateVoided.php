<?php

namespace App\Modules\Medical\Events;

use App\Models\Medical\MedicalCertificate;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MedicalCertificateVoided
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public MedicalCertificate $medicalCertificate,
        public int $voidedByUserId,
    ) {}
}
