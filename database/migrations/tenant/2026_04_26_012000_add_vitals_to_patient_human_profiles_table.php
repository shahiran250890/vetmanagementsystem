<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('patient_human_profiles', function (Blueprint $table) {
            $table->decimal('height_cm', 5, 2)->nullable()->after('address');
            $table->decimal('weight_kg', 5, 2)->nullable()->after('height_cm');
            $table->string('blood_pressure')->nullable()->after('weight_kg');
            $table->text('vital_medical_information')->nullable()->after('blood_pressure');
        });
    }

    public function down(): void
    {
        Schema::table('patient_human_profiles', function (Blueprint $table) {
            $table->dropColumn([
                'height_cm',
                'weight_kg',
                'blood_pressure',
                'vital_medical_information',
            ]);
        });
    }
};
