<?php

use App\Models\Patients\Patient;
use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->string('mmc_registration_number', 64)->nullable()->after('phone');
        });

        Schema::table('organization_profiles', function (Blueprint $table): void {
            $table->text('organization_address')->nullable()->after('organization_license');
        });

        Schema::create('medical_certificates', function (Blueprint $table): void {
            $table->id();
            $table->foreignIdFor(Patient::class)->constrained('patients')->cascadeOnDelete();
            $table->foreignId('medical_record_id')->nullable()->constrained('medical_records')->nullOnDelete();
            $table->foreignIdFor(User::class, 'doctor_id')->constrained('users')->cascadeOnDelete();
            $table->string('certificate_number', 32)->nullable()->unique();
            $table->string('employer_name')->nullable();
            $table->date('unfit_from');
            $table->date('unfit_to');
            $table->text('remarks')->nullable();
            $table->string('status', 20);
            $table->timestamp('issued_at')->nullable();
            $table->timestamp('voided_at')->nullable();
            $table->text('void_reason')->nullable();
            $table->timestamps();

            $table->index(['patient_id', 'created_at']);
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('medical_certificates');

        Schema::table('organization_profiles', function (Blueprint $table): void {
            $table->dropColumn('organization_address');
        });

        Schema::table('users', function (Blueprint $table): void {
            $table->dropColumn('mmc_registration_number');
        });
    }
};
