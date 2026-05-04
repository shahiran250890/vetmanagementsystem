<?php

namespace App\Modules\Patients\Contracts;

use App\Models\Patients\Patient;

interface PatientReadRepository
{
    public function getPatientFullProfile(Patient $patient): Patient;
}
