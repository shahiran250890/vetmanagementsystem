<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('patients')) {
            return;
        }

        if (Schema::hasTable('patient_animal_profiles')) {
            DB::table('patients')
                ->select([
                    'id',
                    'user_id',
                    'patient_type',
                    'species',
                    'breed',
                    'color',
                    'microchip_number',
                    'latest_weight_kg',
                    'vaccination_status',
                ])
                ->where('patient_type', 'animal')
                ->orderBy('id')
                ->chunkById(200, function ($patients): void {
                    $now = now();

                    foreach ($patients as $patient) {
                        $fallbackSpecies = $patient->species ?? 'Unknown';
                        $fallbackWeight = $patient->latest_weight_kg;

                        $existing = DB::table('patient_animal_profiles')
                            ->where('patient_id', $patient->id)
                            ->first();

                        if ($existing !== null) {
                            $species = ($existing->species !== null && $existing->species !== '')
                                ? $existing->species
                                : $fallbackSpecies;
                            $weight = $existing->latest_weight_kg ?? $fallbackWeight;

                            DB::table('patient_animal_profiles')
                                ->where('patient_id', $patient->id)
                                ->update([
                                    'species' => $species,
                                    'latest_weight_kg' => $weight,
                                    'updated_at' => $now,
                                ]);

                            continue;
                        }

                        DB::table('patient_animal_profiles')->insert([
                            'patient_id' => $patient->id,
                            'owner_user_id' => $patient->user_id,
                            'species' => $fallbackSpecies,
                            'breed' => $patient->breed,
                            'color' => $patient->color,
                            'microchip_number' => $patient->microchip_number,
                            'latest_weight_kg' => $fallbackWeight,
                            'vaccination_status' => $patient->vaccination_status,
                            'created_at' => $now,
                            'updated_at' => $now,
                        ]);
                    }
                }, 'id');
        }

        Schema::table('patients', function (Blueprint $table): void {
            if (Schema::hasColumn('patients', 'species')) {
                try {
                    $table->dropIndex(['species']);
                } catch (Throwable) {
                    // Index name may differ by driver; continue to drop columns.
                }
            }
        });

        Schema::table('patients', function (Blueprint $table): void {
            $columns = [];
            if (Schema::hasColumn('patients', 'species')) {
                $columns[] = 'species';
            }
            if (Schema::hasColumn('patients', 'latest_weight_kg')) {
                $columns[] = 'latest_weight_kg';
            }
            if ($columns !== []) {
                $table->dropColumn($columns);
            }
        });
    }

    public function down(): void
    {
        Schema::table('patients', function (Blueprint $table): void {
            if (! Schema::hasColumn('patients', 'species')) {
                $table->string('species')->default('Unknown')->after('name');
            }
            if (! Schema::hasColumn('patients', 'latest_weight_kg')) {
                $table->decimal('latest_weight_kg', 8, 2)->nullable()->after('current_medications');
            }
        });

        Schema::table('patients', function (Blueprint $table): void {
            $table->index('species');
        });
    }
};
