<?php

namespace App\Modules\Patients\Http\Controllers;

use App\Contracts\Clinic\ClinicContext;
use App\Http\Controllers\Controller;
use App\Models\Patients\BloodType;
use App\Models\Patients\Patient;
use App\Modules\Patients\Application\Services\PatientRecordService;
use App\Modules\Patients\Contracts\PatientOwnerDirectory;
use App\Modules\Patients\Contracts\SpeciesBreedCatalog;
use App\Modules\Patients\Events\PatientCreated;
use App\Modules\Patients\Events\PatientUpdated;
use App\Modules\Patients\Http\Requests\StorePatientRequest;
use App\Modules\Patients\Http\Requests\UpdatePatientRequest;
use App\Modules\Patients\Http\Resources\PatientResource;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Inertia\Response;

class PatientController extends Controller
{
    public function __construct(
        protected PatientRecordService $patientRecordService,
        protected ClinicContext $clinicContext,
        protected PatientOwnerDirectory $patientOwnerDirectory,
        protected SpeciesBreedCatalog $speciesBreedCatalog,
    ) {}

    public function index(): Response
    {
        $this->authorize('viewAny', Patient::class);

        $search = request()->string('search')->toString();
        $status = request()->string('status')->toString();
        $perPage = (int) request()->query('per_page', 10);

        if (! in_array($perPage, [10, 25, 50], true)) {
            $perPage = 10;
        }

        $patients = $this->patientRecordService->paginate($search, $status, '', $perPage);

        return Inertia::render('patients/index', [
            'filters' => [
                'search' => $search,
                'status' => $status,
                'per_page' => $perPage,
            ],
            'patients' => $patients->through(
                fn (Patient $patient): array => (new PatientResource($patient))->resolve(),
            ),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Patient::class);

        return Inertia::render('patients/create', [
            'owners' => $this->patientOwnerDirectory->listOwnerOptions(),
            'bloodTypes' => $this->bloodTypeOptions(),
            'speciesOptions' => $this->speciesBreedCatalog->listEnabledSpeciesWithBreeds(),
            'allowedPatientType' => $this->clinicContext->allowedPatientType(),
        ]);
    }

    public function store(StorePatientRequest $request): RedirectResponse
    {
        $this->authorize('create', Patient::class);

        $patient = $this->patientRecordService->create($request->validated());
        event(new PatientCreated($patient));

        return to_route('patients.show', $patient);
    }

    public function show(Patient $patient): Response
    {
        $this->authorize('view', $patient);

        $patient = $this->patientRecordService->show($patient);

        return Inertia::render('patients/show', [
            'patient' => PatientResource::make($patient)->resolve(),
        ]);
    }

    public function edit(Patient $patient): Response
    {
        $this->authorize('update', $patient);

        $patient = $patient->load([
            'animalProfile',
            $this->hasBloodTypesTable() ? 'humanProfile.bloodType' : 'humanProfile',
        ]);

        return Inertia::render('patients/edit', [
            'patient' => PatientResource::make($patient)->resolve(),
            'owners' => $this->patientOwnerDirectory->listOwnerOptions(),
            'bloodTypes' => $this->bloodTypeOptions(),
            'speciesOptions' => $this->speciesBreedCatalog->listEnabledSpeciesWithBreeds(),
            'allowedPatientType' => $this->clinicContext->allowedPatientType(),
        ]);
    }

    public function update(UpdatePatientRequest $request, Patient $patient): RedirectResponse
    {
        $this->authorize('update', $patient);

        $updatedPatient = $this->patientRecordService->update($patient, $request->validated());
        event(new PatientUpdated($updatedPatient));

        return to_route('patients.show', $patient);
    }

    public function destroy(Patient $patient): RedirectResponse
    {
        $this->authorize('delete', $patient);

        $patient->delete();

        return to_route('patients.index');
    }

    /**
     * @return array<int, array{id: int, name: string}>
     */
    protected function bloodTypeOptions(): array
    {
        if (! $this->hasBloodTypesTable()) {
            return [];
        }

        /** @var array<int, array{id: int, name: string}> $bloodTypes */
        $bloodTypes = BloodType::query()
            ->select(['id', 'name'])
            ->orderBy('name')
            ->get()
            ->map(fn (BloodType $bloodType): array => [
                'id' => $bloodType->id,
                'name' => $bloodType->name,
            ])
            ->all();

        return $bloodTypes;
    }

    protected function hasBloodTypesTable(): bool
    {
        return Schema::connection('tenant')->hasTable('blood_types');
    }
}
