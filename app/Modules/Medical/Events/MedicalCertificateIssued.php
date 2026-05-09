<?php

namespace App\Modules\Medical\Events;

use App\Models\Medical\MedicalCertificate;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MedicalCertificateIssued
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public MedicalCertificate $medicalCertificate,
    ) {}
}
