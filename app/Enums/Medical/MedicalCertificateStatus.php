<?php

namespace App\Enums\Medical;

enum MedicalCertificateStatus: string
{
    case Draft = 'draft';
    case Issued = 'issued';
    case Voided = 'voided';
}
