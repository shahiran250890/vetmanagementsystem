<?php

namespace App\Events\Patients;

use App\Models\Patients\PatientHistoryEntry;
use Illuminate\Foundation\Events\Dispatchable;

class PatientHistoryEntryCreated
{
    use Dispatchable;

    public function __construct(public PatientHistoryEntry $entry) {}
}
