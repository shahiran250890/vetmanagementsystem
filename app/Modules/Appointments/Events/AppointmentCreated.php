<?php

namespace App\Modules\Appointments\Events;

use App\Models\Appointments\Appointment;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AppointmentCreated
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public Appointment $appointment,
    ) {}
}
