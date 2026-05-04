<?php

namespace App\Modules\Medical\Policies;

use App\Models\Medical\MedicalRecord;
use App\Models\User;

class MedicalRecordPolicy
{
    public function viewAny(User $user): bool
    {
        return $this->hasClinicalRole($user);
    }

    public function view(User $user, MedicalRecord $medicalRecord): bool
    {
        if (! $this->hasClinicalRole($user)) {
            return false;
        }

        return $this->isElevated($user) || $medicalRecord->doctor_id === $user->id;
    }

    public function create(User $user): bool
    {
        return $this->hasClinicalRole($user);
    }

    public function update(User $user, MedicalRecord $medicalRecord): bool
    {
        if (! $this->hasClinicalRole($user)) {
            return false;
        }

        return $this->isElevated($user) || $medicalRecord->doctor_id === $user->id;
    }

    public function delete(User $user, MedicalRecord $medicalRecord): bool
    {
        if (! $this->hasClinicalRole($user)) {
            return false;
        }

        return $this->isElevated($user) || $medicalRecord->doctor_id === $user->id;
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
