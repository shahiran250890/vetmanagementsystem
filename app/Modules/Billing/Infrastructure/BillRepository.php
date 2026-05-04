<?php

namespace App\Modules\Billing\Infrastructure;

use App\Models\Billing\Bill;
use App\Modules\Billing\Domain\DTOs\BillListFilterDto;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

class BillRepository
{
    public function paginateWithFilters(BillListFilterDto $filters): LengthAwarePaginator
    {
        return Bill::query()
            ->with(['patient', 'items', 'payments'])
            ->when($filters->patientId !== null, fn (Builder $q): Builder => $q->where('patient_id', $filters->patientId))
            ->when($filters->status !== null && $filters->status !== '', fn (Builder $q): Builder => $q->where('status', $filters->status))
            ->orderByDesc('created_at')
            ->paginate($filters->perPage)
            ->withQueryString();
    }
}
