<?php

namespace App\Http\Controllers\Patients;

use App\Events\Patients\PatientCreated;
use App\Events\Patients\PatientUpdated;
use App\Http\Controllers\Controller;
use App\Http\Requests\Patients\StorePatientRequest;
use App\Http\Requests\Patients\UpdatePatientRequest;
use App\Http\Resources\Patients\PatientResource;
use App\Models\Patients\BloodType;
use App\Models\Patients\Patient;
use App\Models\Settings\Species;
use App\Models\User;
use App\Services\Patients\PatientRecordService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Inertia\Response;

class PatientController extends Controller
{
    public function __construct(
        protected PatientRecordService $patientRecordService,
    ) {}

    public function index(): Response
    {
        $search = request()->string('search')->toString();
        $status = request()->string('status')->toString();

        $patients = $this->patientRecordService->paginate($search, $status);

        return Inertia::render('patients/index', [
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
            'patients' => PatientResource::collection($patients),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('patients/create', [
            'owners' => $this->ownerOptions(),
            'bloodTypes' => $this->bloodTypeOptions(),
            'speciesOptions' => $this->speciesOptions(),
        ]);
    }

    public function store(StorePatientRequest $request): RedirectResponse
    {
        $patient = $this->patientRecordService->create($request->validated());
        event(new PatientCreated($patient));

        return to_route('patients.show', $patient);
    }

    public function show(Patient $patient): Response
    {
        $patient = $this->patientRecordService->show($patient);

        return Inertia::render('patients/show', [
            'patient' => PatientResource::make($patient)->resolve(),
        ]);
    }

    public function edit(Patient $patient): Response
    {
        $patient = $patient->load(['animalProfile', 'humanProfile.bloodType']);

        return Inertia::render('patients/edit', [
            'patient' => PatientResource::make($patient)->resolve(),
            'owners' => $this->ownerOptions(),
            'bloodTypes' => $this->bloodTypeOptions(),
            'speciesOptions' => $this->speciesOptions(),
        ]);
    }

    public function update(UpdatePatientRequest $request, Patient $patient): RedirectResponse
    {
        $updatedPatient = $this->patientRecordService->update($patient, $request->validated());
        event(new PatientUpdated($updatedPatient));

        return to_route('patients.show', $patient);
    }

    public function destroy(Patient $patient): RedirectResponse
    {
        $patient->delete();

        return to_route('patients.index');
    }

    /**
     * @return array<int, array{id: int, name: string}>
     */
    protected function ownerOptions(): array
    {
        /** @var array<int, array{id: int, name: string}> $owners */
        $owners = User::query()
            ->select(['id', 'name'])
            ->orderBy('name')
            ->get()
            ->map(fn (User $owner): array => [
                'id' => $owner->id,
                'name' => $owner->name,
            ])
            ->all();

        return $owners;
    }

    /**
     * @return array<int, array{id: int, name: string}>
     */
    protected function bloodTypeOptions(): array
    {
        if (! Schema::connection('tenant')->hasTable('blood_types')) {
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

    /**
     * @return array<int, array{id: int, name: string, breeds: array<int, array{id: int, name: string}>}>
     */
    protected function speciesOptions(): array
    {
        if (! Schema::connection('tenant')->hasTable('species') || ! Schema::connection('tenant')->hasTable('breeds')) {
            return [];
        }

        /** @var array<int, array{id: int, name: string, breeds: array<int, array{id: int, name: string}>}> $species */
        $species = Species::query()
            ->select(['id', 'name'])
            ->where('is_enabled', true)
            ->with(['breeds' => fn ($query) => $query
                ->select(['id', 'species_id', 'name'])
                ->where('is_enabled', true)
                ->orderBy('name')])
            ->orderBy('name')
            ->get()
            ->map(fn (Species $item): array => [
                'id' => $item->id,
                'name' => $item->name,
                'breeds' => $item->breeds
                    ->map(fn ($breed): array => [
                        'id' => $breed->id,
                        'name' => $breed->name,
                    ])
                    ->all(),
            ])
            ->all();

        return $species;
    }
}
