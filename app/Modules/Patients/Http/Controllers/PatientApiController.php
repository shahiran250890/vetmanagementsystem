<?php

namespace App\Modules\Patients\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Responses\BaseApiResponse;
use App\Models\Patients\Patient;
use App\Modules\Patients\Application\Services\PatientRecordService;
use App\Modules\Patients\Contracts\PatientReadRepository;
use App\Modules\Patients\Http\Requests\StorePatientRequest;
use App\Modules\Patients\Http\Requests\UpdatePatientRequest;
use App\Modules\Patients\Http\Resources\PatientResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PatientApiController extends Controller
{
    public function __construct(
        protected PatientRecordService $patientRecordService,
        protected PatientReadRepository $patientReadRepository,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Patient::class);

        $search = $request->string('search')->toString();
        $status = $request->string('status')->toString();
        $patientType = $request->string('patient_type')->toString();
        $perPage = min(100, max(1, (int) $request->input('per_page', 15)));

        $patients = $this->patientRecordService->paginate($search, $status, $patientType, $perPage);

        return BaseApiResponse::success(
            PatientResource::collection($patients),
            'Patients retrieved.',
            [
                'pagination' => [
                    'current_page' => $patients->currentPage(),
                    'last_page' => $patients->lastPage(),
                    'per_page' => $patients->perPage(),
                    'total' => $patients->total(),
                ],
                'filters' => [
                    'search' => $search,
                    'status' => $status,
                    'patient_type' => $patientType,
                ],
            ],
        );
    }

    public function store(StorePatientRequest $request): JsonResponse
    {
        $this->authorize('create', Patient::class);

        $patient = $this->patientRecordService->create($request->validated());

        return BaseApiResponse::success(
            PatientResource::make($patient),
            'Patient created.',
        );
    }

    public function show(Patient $patient): JsonResponse
    {
        $this->authorize('view', $patient);

        $patient = $this->patientReadRepository->getPatientFullProfile($patient);

        return BaseApiResponse::success(
            PatientResource::make($patient),
            'Patient retrieved.',
        );
    }

    public function update(UpdatePatientRequest $request, Patient $patient): JsonResponse
    {
        $this->authorize('update', $patient);

        $updated = $this->patientRecordService->update($patient, $request->validated());

        return BaseApiResponse::success(
            PatientResource::make($updated),
            'Patient updated.',
        );
    }

    public function destroy(Patient $patient): JsonResponse
    {
        $this->authorize('delete', $patient);

        $patient->delete();

        return BaseApiResponse::success([], 'Patient deleted.');
    }
}
