<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('patient_animal_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->unique()->constrained('patients')->cascadeOnDelete();
            $table->foreignId('owner_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('species');
            $table->string('breed')->nullable();
            $table->string('color')->nullable();
            $table->string('microchip_number')->nullable();
            $table->decimal('latest_weight_kg', 8, 2)->nullable();
            $table->string('vaccination_status')->nullable();
            $table->timestamps();

            $table->index('species');
            $table->index('microchip_number');
            $table->index('owner_user_id');
        });

        DB::table('patients')
            ->select([
                'id',
                'user_id',
                'species',
                'breed',
                'color',
                'microchip_number',
                'latest_weight_kg',
                'vaccination_status',
            ])
            ->orderBy('id')
            ->chunkById(200, function ($patients): void {
                $now = now();
                $rows = [];

                foreach ($patients as $patient) {
                    $rows[] = [
                        'patient_id' => $patient->id,
                        'owner_user_id' => $patient->user_id,
                        'species' => $patient->species ?? 'Unknown',
                        'breed' => $patient->breed,
                        'color' => $patient->color,
                        'microchip_number' => $patient->microchip_number,
                        'latest_weight_kg' => $patient->latest_weight_kg,
                        'vaccination_status' => $patient->vaccination_status,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ];
                }

                if ($rows !== []) {
                    DB::table('patient_animal_profiles')->upsert(
                        $rows,
                        ['patient_id'],
                        [
                            'owner_user_id',
                            'species',
                            'breed',
                            'color',
                            'microchip_number',
                            'latest_weight_kg',
                            'vaccination_status',
                            'updated_at',
                        ],
                    );
                }
            }, 'id');
    }

    public function down(): void
    {
        Schema::dropIfExists('patient_animal_profiles');
    }
};
