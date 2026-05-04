<?php

namespace App\Modules\Patients\Application\Services;

use App\Models\Patients\BloodType;
use App\Models\Patients\Patient;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class PatientRecordService
{
    public function paginate(string $search, string $status, string $patientType = '', int $perPage = 10): LengthAwarePaginator
    {
        return Patient::query()
            ->with(['animalProfile', 'humanProfile', 'user'])
            ->when($patientType !== '', fn (Builder $query): Builder => $query->where('patient_type', $patientType))
            ->when($search !== '', function (Builder $query) use ($search): void {
                $query->where(function (Builder $subQuery) use ($search): void {
                    $subQuery
                        ->where('name', 'like', "%{$search}%")
                        ->orWhereHas('animalProfile', function (Builder $animalQuery) use ($search): void {
                            $animalQuery
                                ->where('species', 'like', "%{$search}%")
                                ->orWhere('microchip_number', 'like', "%{$search}%");
                        });
                });
            })
            ->when($status !== '', fn (Builder $query): Builder => $query->where('status', $status))
            ->latest()
            ->paginate($perPage)
            ->withQueryString();
    }

    /**
     * @param  array<string, mixed>  $validated
     */
    public function create(array $validated): Patient
    {
        return DB::transaction(function () use ($validated): Patient {
            $patient = Patient::query()->create($this->patientPayload($validated));
            $this->syncProfiles($patient, $validated);

            return $patient->load($this->patientRelationsForRead());
        });
    }

    /**
     * @param  array<string, mixed>  $validated
     */
    public function update(Patient $patient, array $validated): Patient
    {
        return DB::transaction(function () use ($patient, $validated): Patient {
            $patient->update($this->patientPayload($validated));
            $this->syncProfiles($patient, $validated);

            return $patient->fresh(array_merge($this->patientRelationsForRead(), ['user']));
        });
    }

    public function show(Patient $patient): Patient
    {
        return $patient->load([
            ...$this->patientRelationsForRead(),
            'user',
            'historyEntries' => fn (HasMany $query): HasMany => $query->latest(),
            'historyEntries.creator',
        ]);
    }

    /**
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    protected function patientPayload(array $validated): array
    {
        $animal = Arr::get($validated, 'animal_profile', []);
        $patientType = Arr::get($validated, 'patient_type', 'animal');

        return [
            'patient_type' => $patientType,
            'user_id' => $patientType === 'animal' ? Arr::get($animal, 'owner_user_id') : null,
            'name' => Arr::get($validated, 'name'),
            'breed' => $patientType === 'animal' ? Arr::get($animal, 'breed') : null,
            'sex' => Arr::get($validated, 'sex'),
            'date_of_birth' => Arr::get($validated, 'date_of_birth'),
            'color' => $patientType === 'animal' ? Arr::get($animal, 'color') : null,
            'microchip_number' => $patientType === 'animal' ? Arr::get($animal, 'microchip_number') : null,
            'emergency_contact_name' => Arr::get($validated, 'emergency_contact_name'),
            'emergency_contact_phone' => Arr::get($validated, 'emergency_contact_phone'),
            'allergies' => Arr::get($validated, 'allergies'),
            'current_medications' => Arr::get($validated, 'current_medications'),
            'vaccination_status' => $patientType === 'animal' ? Arr::get($animal, 'vaccination_status') : null,
            'status' => Arr::get($validated, 'status'),
            'notes' => Arr::get($validated, 'notes'),
        ];
    }

    /**
     * @param  array<string, mixed>  $validated
     */
    protected function syncProfiles(Patient $patient, array $validated): void
    {
        if ($patient->patient_type === 'animal') {
            $animal = Arr::get($validated, 'animal_profile', []);

            $patient->animalProfile()->updateOrCreate(
                ['patient_id' => $patient->id],
                [
                    'owner_user_id' => Arr::get($animal, 'owner_user_id'),
                    'species' => Arr::get($animal, 'species', 'Unknown'),
                    'breed' => Arr::get($animal, 'breed'),
                    'color' => Arr::get($animal, 'color'),
                    'microchip_number' => Arr::get($animal, 'microchip_number'),
                    'latest_weight_kg' => Arr::get($animal, 'latest_weight_kg'),
                    'vaccination_status' => Arr::get($animal, 'vaccination_status'),
                ],
            );
            $patient->humanProfile()?->delete();

            return;
        }

        $human = Arr::get($validated, 'human_profile', []);
        $bloodTypeId = Arr::get($human, 'blood_type_id');
        $bloodTypeName = null;

        if ($this->hasBloodTypesTable() && $bloodTypeId !== null && $bloodTypeId !== '') {
            $bloodTypeName = BloodType::query()->find($bloodTypeId)?->name;
        } else {
            $bloodTypeId = null;
        }

        $patient->humanProfile()->updateOrCreate(
            ['patient_id' => $patient->id],
            [
                'identification_number' => Arr::get($human, 'identification_number'),
                'blood_type_id' => $bloodTypeId ?: null,
                'blood_type' => $bloodTypeName,
                'primary_phone' => Arr::get($human, 'primary_phone'),
                'address' => Arr::get($human, 'address'),
                'height_cm' => Arr::get($human, 'height_cm'),
                'weight_kg' => Arr::get($human, 'weight_kg'),
                'blood_pressure' => Arr::get($human, 'blood_pressure'),
                'vital_medical_information' => Arr::get($human, 'vital_medical_information'),
            ],
        );
        $patient->animalProfile()?->delete();
    }

    /**
     * @return array<int, string>
     */
    protected function patientRelationsForRead(): array
    {
        return [
            'animalProfile.owner',
            $this->hasBloodTypesTable() ? 'humanProfile.bloodType' : 'humanProfile',
        ];
    }

    protected function hasBloodTypesTable(): bool
    {
        return Schema::connection('tenant')->hasTable('blood_types');
    }
}
