<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('patient_human_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->unique()->constrained('patients')->cascadeOnDelete();
            $table->string('identification_number')->nullable();
            $table->string('blood_type')->nullable();
            $table->string('primary_phone')->nullable();
            $table->text('address')->nullable();
            $table->timestamps();

            $table->index('identification_number');
            $table->index('blood_type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('patient_human_profiles');
    }
};
