<?php

namespace App\Modules\Medical\Events;

use App\Models\Medical\MedicalRecord;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MedicalRecordCreated
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public MedicalRecord $medicalRecord,
    ) {}
}
