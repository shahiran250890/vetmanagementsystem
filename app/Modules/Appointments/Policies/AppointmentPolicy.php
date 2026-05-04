<?php

namespace App\Modules\Appointments\Policies;

use App\Models\Appointments\Appointment;
use App\Models\User;

class AppointmentPolicy
{
    public function viewAny(User $user): bool
    {
        return $this->hasClinicalRole($user);
    }

    public function view(User $user, Appointment $appointment): bool
    {
        if (! $this->hasClinicalRole($user)) {
            return false;
        }

        return $this->isElevated($user) || $appointment->doctor_id === $user->id;
    }

    public function create(User $user): bool
    {
        return $this->hasClinicalRole($user);
    }

    public function update(User $user, Appointment $appointment): bool
    {
        if (! $this->hasClinicalRole($user)) {
            return false;
        }

        return $this->isElevated($user) || $appointment->doctor_id === $user->id;
    }

    public function delete(User $user, Appointment $appointment): bool
    {
        if (! $this->hasClinicalRole($user)) {
            return false;
        }

        return $this->isElevated($user) || $appointment->doctor_id === $user->id;
    }

    private function hasClinicalRole(User $user): bool
    {
        return $user->hasAnyRole(['admin', 'superadmin', 'doctor', 'receptionist']);
    }

    private function isElevated(User $user): bool
    {
        return $user->hasAnyRole(['admin', 'superadmin', 'receptionist']);
    }
}
