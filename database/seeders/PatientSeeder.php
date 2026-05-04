<?php

namespace Database\Seeders;

use App\Models\Patients\Patient;
use App\Models\Patients\PatientHistoryEntry;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;

class PatientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        PatientHistoryEntry::query()->delete();

        Patient::query()->withTrashed()->each(function (Patient $patient): void {
            $patient->forceDelete();
        });

        $ownerUserIds = User::query()
            ->whereHas('roles', fn ($query) => $query->whereIn('name', [
                'admin',
                'doctor',
                'receptionist',
                'nurse',
            ]))
            ->pluck('id');

        if ($ownerUserIds->isEmpty()) {
            $ownerUserIds = User::query()->pluck('id');
        }

        $actorUserIds = User::query()->pluck('id');

        for ($i = 0; $i < 15; $i++) {
            $patient = Patient::factory()->create([
                'patient_type' => 'animal',
                'user_id' => $ownerUserIds->isEmpty() ? null : $ownerUserIds->random(),
            ]);

            $this->seedHistoryForPatient($patient, $actorUserIds);
        }

        for ($i = 0; $i < 5; $i++) {
            $patient = Patient::factory()->human()->create([
                'user_id' => $ownerUserIds->isEmpty() ? null : $ownerUserIds->random(),
            ]);

            $this->seedHistoryForPatient($patient, $actorUserIds);
        }
    }

    /**
     * @param  Collection<int, int>  $actorUserIds
     */
    private function seedHistoryForPatient(Patient $patient, Collection $actorUserIds): void
    {
        PatientHistoryEntry::factory()
            ->count(fake()->numberBetween(1, 4))
            ->create([
                'patient_id' => $patient->id,
                'created_by' => $actorUserIds->isEmpty() ? null : $actorUserIds->random(),
            ]);
    }
}
