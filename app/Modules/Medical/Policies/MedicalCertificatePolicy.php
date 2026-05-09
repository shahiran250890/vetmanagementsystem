<?php

namespace App\Modules\Medical\Policies;

use App\Models\Medical\MedicalCertificate;
use App\Models\User;

class MedicalCertificatePolicy
{
    public function viewAny(User $user): bool
    {
        return $this->hasClinicalRole($user);
    }

    public function view(User $user, MedicalCertificate $medicalCertificate): bool
    {
        if (! $this->hasClinicalRole($user)) {
            return false;
        }

        return $this->isElevated($user) || $medicalCertificate->doctor_id === $user->id;
    }

    public function create(User $user): bool
    {
        return $this->hasClinicalRole($user);
    }

    public function void(User $user, MedicalCertificate $medicalCertificate): bool
    {
        if (! $this->hasClinicalRole($user)) {
            return false;
        }

        if ($medicalCertificate->isVoided()) {
            return false;
        }

        return $this->isElevated($user) || $medicalCertificate->doctor_id === $user->id;
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
