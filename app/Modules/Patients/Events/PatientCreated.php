<?php

namespace App\Modules\Patients\Events;

use App\Models\Patients\Patient;
use Illuminate\Foundation\Events\Dispatchable;

class PatientCreated
{
    use Dispatchable;

    public function __construct(public Patient $patient) {}
}
