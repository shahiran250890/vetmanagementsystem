<?php

namespace App\Http\Controllers\Patients;

use App\Events\Patients\PatientHistoryEntryCreated;
use App\Http\Controllers\Controller;
use App\Http\Requests\Patients\StorePatientHistoryEntryRequest;
use App\Models\Patients\Patient;
use App\Services\Patients\PatientHistoryService;
use Illuminate\Http\RedirectResponse;

class PatientHistoryController extends Controller
{
    public function __construct(
        protected PatientHistoryService $patientHistoryService,
    ) {}

    public function store(StorePatientHistoryEntryRequest $request, Patient $patient): RedirectResponse
    {
        $entry = $this->patientHistoryService->create(
            $patient,
            $request->validated(),
            $request->user()->id,
        );

        event(new PatientHistoryEntryCreated($entry));

        return to_route('patients.show', $patient);
    }
}
