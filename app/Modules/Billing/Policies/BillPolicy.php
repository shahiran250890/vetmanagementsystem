<?php

namespace App\Modules\Billing\Policies;

use App\Models\Billing\Bill;
use App\Models\User;

class BillPolicy
{
    public function viewAny(User $user): bool
    {
        return $this->hasBillingRole($user);
    }

    public function view(User $user, Bill $bill): bool
    {
        return $this->hasBillingRole($user);
    }

    public function create(User $user): bool
    {
        return $this->hasBillingRole($user);
    }

    public function update(User $user, Bill $bill): bool
    {
        return $this->hasBillingRole($user);
    }

    public function delete(User $user, Bill $bill): bool
    {
        return $user->hasAnyRole(['admin', 'superadmin']);
    }

    private function hasBillingRole(User $user): bool
    {
        return $user->hasAnyRole(['admin', 'superadmin', 'doctor', 'receptionist']);
    }
}
