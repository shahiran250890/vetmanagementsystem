<?php

namespace App\Http\Controllers\Patients;

use App\Events\Patients\PatientHistoryEntryCreated;
use App\Http\Controllers\Controller;
use App\Http\Requests\Patients\StorePatientHistoryEntryRequest;
use App\Models\Patients\Patient;
use Illuminate\Http\RedirectResponse;

class PatientHistoryController extends Controller
{
    public function store(StorePatientHistoryEntryRequest $request, Patient $patient): RedirectResponse
    {
        $entry = $patient->historyEntries()->create([
            ...$request->validated(),
            'created_by' => $request->user()->id,
        ]);

        event(new PatientHistoryEntryCreated($entry));

        return to_route('patients.show', $patient);
    }
}
