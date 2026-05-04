<?php

namespace App\Modules\Patients\Events;

use App\Models\Patients\PatientHistoryEntry;
use Illuminate\Foundation\Events\Dispatchable;

class PatientHistoryEntryCreated
{
    use Dispatchable;

    public function __construct(public PatientHistoryEntry $entry) {}
}
