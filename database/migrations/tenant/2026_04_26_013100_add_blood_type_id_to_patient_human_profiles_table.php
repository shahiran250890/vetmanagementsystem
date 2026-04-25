<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('blood_types')) {
            return;
        }

        Schema::table('patient_human_profiles', function (Blueprint $table) {
            $table->foreignId('blood_type_id')->nullable()->after('blood_type')->constrained('blood_types')->nullOnDelete();
        });

        $bloodTypeMap = DB::table('blood_types')
            ->pluck('id', 'name')
            ->all();

        if ($bloodTypeMap !== []) {
            DB::table('patient_human_profiles')
                ->whereNotNull('blood_type')
                ->orderBy('id')
                ->chunkById(200, function ($profiles) use ($bloodTypeMap): void {
                    foreach ($profiles as $profile) {
                        $bloodTypeId = $bloodTypeMap[$profile->blood_type] ?? null;

                        if ($bloodTypeId === null) {
                            continue;
                        }

                        DB::table('patient_human_profiles')
                            ->where('id', $profile->id)
                            ->update(['blood_type_id' => $bloodTypeId]);
                    }
                }, 'id');
        }
    }

    public function down(): void
    {
        if (! Schema::hasColumn('patient_human_profiles', 'blood_type_id')) {
            return;
        }

        Schema::table('patient_human_profiles', function (Blueprint $table) {
            $table->dropForeign(['blood_type_id']);
            $table->dropColumn('blood_type_id');
        });
    }
};
