<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('patients', function (Blueprint $table) {
            $table->string('patient_type')->default('animal')->after('name');
            $table->index('patient_type');
        });

        DB::table('patients')
            ->whereNull('patient_type')
            ->update(['patient_type' => 'animal']);
    }

    public function down(): void
    {
        Schema::table('patients', function (Blueprint $table) {
            $table->dropIndex(['patient_type']);
            $table->dropColumn('patient_type');
        });
    }
};
