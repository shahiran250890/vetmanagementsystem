<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('patient_history_entries')) {
            Schema::create('patient_history_entries', function (Blueprint $table): void {
                $table->id();
                $table->foreignId('patient_id')->constrained('patients')->cascadeOnDelete();
                $table->nullableMorphs('reference');
                $table->string('action');
                $table->text('description')->nullable();
                $table->json('metadata')->nullable();
                $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
                $table->timestamps();

                $table->index(['patient_id', 'created_at']);
            });

            return;
        }

        if (Schema::getConnection()->getDriverName() !== 'sqlite') {
            Schema::table('patient_history_entries', function (Blueprint $table): void {
                foreach ([
                    'patient_history_entries_patient_id_foreign',
                    'patient_history_entries_created_by_foreign',
                    'patient_history_entries_veterinarian_user_id_foreign',
                    'patient_history_entries_assistant_user_id_foreign',
                ] as $foreign) {
                    try {
                        $table->dropForeign($foreign);
                    } catch (Throwable) {
                        //
                    }
                }
            });
        }

        Schema::rename('patient_history_entries', 'patient_history_entries_legacy');

        Schema::create('patient_history_entries', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('patient_id')->constrained('patients')->cascadeOnDelete();
            $table->nullableMorphs('reference');
            $table->string('action');
            $table->text('description')->nullable();
            $table->json('metadata')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index(['patient_id', 'created_at']);
        });

        if (Schema::hasTable('patient_history_entries_legacy')) {
            DB::table('patient_history_entries_legacy')
                ->orderBy('id')
                ->chunkById(200, function ($rows): void {
                    foreach ($rows as $row) {
                        $metadata = [
                            'legacy' => true,
                            'entry_date' => $row->entry_date ?? null,
                            'visit_case_number' => $row->visit_case_number ?? null,
                            'visit_at' => $row->visit_at ?? null,
                            'clinic_location' => $row->clinic_location ?? null,
                            'veterinarian_user_id' => $row->veterinarian_user_id ?? null,
                            'assistant_user_id' => $row->assistant_user_id ?? null,
                            'visit_type' => $row->visit_type ?? null,
                            'appointment_id' => $row->appointment_id ?? null,
                            'visit_status' => $row->visit_status ?? null,
                            'entry_type' => $row->entry_type ?? null,
                            'title' => $row->title ?? null,
                            'details' => $row->details ?? null,
                        ];

                        DB::table('patient_history_entries')->insert([
                            'patient_id' => $row->patient_id,
                            'reference_type' => null,
                            'reference_id' => null,
                            'action' => 'legacy.history_entry',
                            'description' => isset($row->title) ? (string) $row->title : null,
                            'metadata' => json_encode($metadata),
                            'created_by' => $row->created_by,
                            'created_at' => $row->created_at ?? now(),
                            'updated_at' => $row->updated_at ?? now(),
                        ]);
                    }
                }, 'id');
        }

        Schema::dropIfExists('patient_history_entries_legacy');
    }

    public function down(): void
    {
        Schema::dropIfExists('patient_history_entries');

        Schema::create('patient_history_entries', function (Blueprint $table): void {
            $table->id();
            $table->unsignedBigInteger('patient_id');
            $table->unsignedBigInteger('created_by')->nullable();
            $table->string('visit_case_number')->nullable();
            $table->date('entry_date');
            $table->dateTime('visit_at')->nullable();
            $table->string('clinic_location')->nullable();
            $table->unsignedBigInteger('veterinarian_user_id')->nullable();
            $table->unsignedBigInteger('assistant_user_id')->nullable();
            $table->string('visit_type')->nullable();
            $table->string('appointment_id')->nullable();
            $table->string('visit_status')->nullable();
            $table->string('entry_type')->nullable();
            $table->string('title');
            $table->text('details');
            $table->timestamps();

            $table->index(['patient_id', 'entry_date']);
        });
    }
};
