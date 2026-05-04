<?php

namespace App\Modules\Patients\Infrastructure;

use App\Models\Patients\Patient;
use App\Modules\Patients\Contracts\PatientReadRepository;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EloquentPatientReadRepository implements PatientReadRepository
{
    public function getPatientFullProfile(Patient $patient): Patient
    {
        return $patient->load([
            'animalProfile.owner',
            'humanProfile',
            'user',
            'appointments' => fn (HasMany $q) => $q->latest('appointment_datetime')->limit(25),
            'appointments.doctor',
            'medicalRecords' => fn (HasMany $q) => $q->latest()->limit(25),
            'medicalRecords.doctor',
            'medicalRecords.prescriptions',
            'bills' => fn (HasMany $q) => $q->latest()->limit(25),
            'bills.items',
            'bills.payments',
            'vitals' => fn (HasMany $q) => $q->latest('recorded_at')->limit(50),
            'historyEntries' => fn (HasMany $q) => $q->latest()->limit(100),
            'historyEntries.creator',
        ]);
    }
}
