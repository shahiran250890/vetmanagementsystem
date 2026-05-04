<?php

namespace App\Modules\Medical\Infrastructure;

use App\Models\Medical\MedicalRecord;
use App\Models\User;
use App\Modules\Medical\Domain\DTOs\MedicalRecordListFilterDto;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

class MedicalRecordRepository
{
    public function paginateWithFilters(MedicalRecordListFilterDto $filters, ?User $viewer = null): LengthAwarePaginator
    {
        $doctorScoped = $viewer !== null
            && $viewer->hasRole('doctor')
            && ! $viewer->hasAnyRole(['admin', 'superadmin', 'receptionist']);

        return MedicalRecord::query()
            ->with(['patient', 'doctor', 'appointment', 'prescriptions'])
            ->when($doctorScoped, fn (Builder $q): Builder => $q->where('doctor_id', $viewer->id))
            ->when($filters->patientId !== null, fn (Builder $q): Builder => $q->where('patient_id', $filters->patientId))
            ->when(! $doctorScoped && $filters->doctorId !== null, fn (Builder $q): Builder => $q->where('doctor_id', $filters->doctorId))
            ->orderByDesc('created_at')
            ->paginate($filters->perPage)
            ->withQueryString();
    }
}
