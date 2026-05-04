<?php

namespace App\Contracts\Clinic;

interface ClinicContext
{
    /**
     * When organization clinic type restricts patient records, return that type; otherwise null allows both.
     */
    public function allowedPatientType(): ?string;
}
