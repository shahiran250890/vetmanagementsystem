<?php

namespace App\Modules\Billing\Policies;

use App\Models\Billing\Payment;
use App\Models\User;

class PaymentPolicy
{
    public function viewAny(User $user): bool
    {
        return $this->hasBillingRole($user);
    }

    public function view(User $user, Payment $payment): bool
    {
        if (! $this->hasBillingRole($user)) {
            return false;
        }

        $payment->loadMissing('bill');

        return $payment->bill !== null && $user->can('view', $payment->bill);
    }

    public function create(User $user): bool
    {
        return $this->hasBillingRole($user);
    }

    public function update(User $user, Payment $payment): bool
    {
        return $user->hasAnyRole(['admin', 'superadmin', 'receptionist']);
    }

    public function delete(User $user, Payment $payment): bool
    {
        return $user->hasAnyRole(['admin', 'superadmin']);
    }

    private function hasBillingRole(User $user): bool
    {
        return $user->hasAnyRole(['admin', 'superadmin', 'doctor', 'receptionist']);
    }
}
