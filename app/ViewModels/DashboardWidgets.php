<?php

namespace App\ViewModels;

use App\Models\User;

class DashboardWidgets
{
    public const TOTAL_PATIENTS = 'total_patients';

    public const TODAY_APPOINTMENTS = 'today_appointments';

    public const RECENT_REVENUE = 'recent_revenue';

    public const MY_SCHEDULE = 'my_schedule';

    /**
     * @return list<string>
     */
    public static function visibleFor(?User $user): array
    {
        if ($user === null) {
            return [];
        }

        $ids = [];

        if ($user->hasAnyRole(['admin', 'superadmin', 'doctor', 'receptionist', 'nurse'])) {
            $ids[] = self::TOTAL_PATIENTS;
        }

        if ($user->hasAnyRole(['admin', 'superadmin', 'doctor', 'receptionist'])) {
            $ids[] = self::TODAY_APPOINTMENTS;
        }

        if ($user->hasAnyRole(['admin', 'superadmin', 'receptionist'])) {
            $ids[] = self::RECENT_REVENUE;
        }

        if ($user->hasRole('doctor')) {
            $ids[] = self::MY_SCHEDULE;
        }

        return array_values(array_unique($ids));
    }
}
