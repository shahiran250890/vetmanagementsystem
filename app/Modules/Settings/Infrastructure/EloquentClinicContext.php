<?php

namespace App\Modules\Settings\Infrastructure;

use App\Contracts\Clinic\ClinicContext;
use App\Models\Settings\OrganizationProfile;

final class EloquentClinicContext implements ClinicContext
{
    public function allowedPatientType(): ?string
    {
        $clinicType = OrganizationProfile::query()->value('clinic_type');

        return match ($clinicType) {
            'human' => 'human',
            'vet' => 'animal',
            default => null,
        };
    }
}
