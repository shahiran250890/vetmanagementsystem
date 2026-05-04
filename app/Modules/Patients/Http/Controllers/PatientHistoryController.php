<?php

namespace App\Modules\Patients\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Patients\Patient;
use App\Modules\Patients\Application\Services\PatientHistoryService;
use App\Modules\Patients\Events\PatientHistoryEntryCreated;
use App\Modules\Patients\Http\Requests\StorePatientHistoryEntryRequest;
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
