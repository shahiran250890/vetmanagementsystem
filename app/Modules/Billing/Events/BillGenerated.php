<?php

namespace App\Modules\Billing\Events;

use App\Models\Billing\Bill;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class BillGenerated
{
    use Dispatchable, SerializesModels;

    public function __construct(
        public Bill $bill,
    ) {}
}
