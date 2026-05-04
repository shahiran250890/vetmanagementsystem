<?php

namespace App\Enums\Appointments;

enum AppointmentStatus: string
{
    case Pending = 'pending';
    case Completed = 'completed';
    case Cancelled = 'cancelled';
}
