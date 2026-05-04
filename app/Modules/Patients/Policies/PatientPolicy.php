<?php

namespace App\Modules\Patients\Policies;

use App\Models\Patients\Patient;
use App\Models\User;

class PatientPolicy
{
    public function viewAny(?User $user): bool
    {
        return $user !== null;
    }

    public function view(?User $user, Patient $patient): bool
    {
        return $user !== null;
    }

    public function create(?User $user): bool
    {
        return $user !== null;
    }

    public function update(?User $user, Patient $patient): bool
    {
        return $user !== null;
    }

    public function delete(?User $user, Patient $patient): bool
    {
        return $user !== null;
    }
}
