<?php

namespace App\Enums\Billing;

enum BillStatus: string
{
    case Unpaid = 'unpaid';
    case Paid = 'paid';
}
