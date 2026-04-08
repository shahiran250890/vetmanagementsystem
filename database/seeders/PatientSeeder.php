<?php

namespace Database\Seeders;

use App\Models\Patients\Patient;
use App\Models\Patients\PatientHistoryEntry;
use App\Models\User;
use Illuminate\Database\Seeder;

class PatientSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        PatientHistoryEntry::query()->delete();
        Patient::query()->delete();

        $eligibleUserIds = User::query()
            ->whereKeyNot(1)
            ->pluck('id');

        if ($eligibleUserIds->isEmpty()) {
            User::factory()->count(3)->create();
            $eligibleUserIds = User::query()->whereKeyNot(1)->pluck('id');
        }

        Patient::factory()
            ->count(20)
            ->make()
            ->each(function (Patient $patient) use ($eligibleUserIds): void {
                $patient->user_id = $eligibleUserIds->random();
                $patient->save();

                PatientHistoryEntry::factory()
                    ->count(fake()->numberBetween(1, 4))
                    ->create([
                        'patient_id' => $patient->id,
                        'created_by' => $eligibleUserIds->random(),
                    ]);
            });
    }
}
