<?php

namespace App\Modules\Appointments\Infrastructure;

use App\Models\Appointments\Appointment;
use App\Models\User;
use App\Modules\Appointments\Domain\DTOs\AppointmentListFilterDto;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;

class AppointmentRepository
{
    public function paginateWithFilters(AppointmentListFilterDto $filters, ?User $viewer = null): LengthAwarePaginator
    {
        $doctorScoped = $viewer !== null
            && $viewer->hasRole('doctor')
            && ! $viewer->hasAnyRole(['admin', 'superadmin', 'receptionist']);

        return Appointment::query()
            ->with(['patient', 'doctor'])
            ->when($doctorScoped, fn (Builder $q): Builder => $q->where('doctor_id', $viewer->id))
            ->when($filters->patientId !== null, fn (Builder $q): Builder => $q->where('patient_id', $filters->patientId))
            ->when(! $doctorScoped && $filters->doctorId !== null, fn (Builder $q): Builder => $q->where('doctor_id', $filters->doctorId))
            ->when($filters->status !== null && $filters->status !== '', fn (Builder $q): Builder => $q->where('status', $filters->status))
            ->when($filters->fromDate !== null && $filters->fromDate !== '', function (Builder $q) use ($filters): void {
                $q->whereDate('appointment_datetime', '>=', $filters->fromDate);
            })
            ->when($filters->toDate !== null && $filters->toDate !== '', function (Builder $q) use ($filters): void {
                $q->whereDate('appointment_datetime', '<=', $filters->toDate);
            })
            ->orderByDesc('appointment_datetime')
            ->paginate($filters->perPage)
            ->withQueryString();
    }
}
