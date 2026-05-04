<?php

namespace App\Enums\Appointments;

enum AppointmentType: string
{
    case WalkIn = 'walk_in';
    case Scheduled = 'scheduled';
}
