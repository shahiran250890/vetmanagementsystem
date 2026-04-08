<?php

namespace App\Http\Controllers\Patients;

use App\Events\Patients\PatientCreated;
use App\Events\Patients\PatientUpdated;
use App\Http\Controllers\Controller;
use App\Http\Requests\Patients\StorePatientRequest;
use App\Http\Requests\Patients\UpdatePatientRequest;
use App\Models\Patients\Patient;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class PatientController extends Controller
{
    public function index(): Response
    {
        $search = request()->string('search')->toString();
        $status = request()->string('status')->toString();

        $patients = Patient::query()
            ->with('user')
            ->when($search !== '', function ($query) use ($search): void {
                $query->where(function ($subQuery) use ($search): void {
                    $subQuery
                        ->where('name', 'like', "%{$search}%")
                        ->orWhere('species', 'like', "%{$search}%")
                        ->orWhere('microchip_number', 'like', "%{$search}%");
                });
            })
            ->when($status !== '', fn ($query) => $query->where('status', $status))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('patients/index', [
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
            'patients' => $patients,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('patients/create', [
            'owners' => $this->ownerOptions(),
        ]);
    }

    public function store(StorePatientRequest $request): RedirectResponse
    {
        $patient = Patient::query()->create($request->validated());
        event(new PatientCreated($patient));

        return to_route('patients.show', $patient);
    }

    public function show(Patient $patient): Response
    {
        $patient->load([
            'user',
            'historyEntries' => fn ($query) => $query->latest('entry_date')->latest(),
            'historyEntries.creator',
        ]);

        return Inertia::render('patients/show', [
            'patient' => $patient,
        ]);
    }

    public function edit(Patient $patient): Response
    {
        return Inertia::render('patients/edit', [
            'patient' => $patient,
            'owners' => $this->ownerOptions(),
        ]);
    }

    public function update(UpdatePatientRequest $request, Patient $patient): RedirectResponse
    {
        $patient->update($request->validated());
        event(new PatientUpdated($patient->fresh()));

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
}
