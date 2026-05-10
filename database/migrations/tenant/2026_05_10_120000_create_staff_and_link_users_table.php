<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('staff', function (Blueprint $table) {
            $table->id();
            $table->string('staff_number')->unique();
            $table->string('full_name');
            $table->string('preferred_name')->nullable();
            $table->string('nric_passport', 64)->nullable();
            $table->char('gender', 2)->nullable()->comment('Staff form: 1=Male, 2=Female');
            $table->date('date_of_birth')->nullable();
            $table->string('nationality', 120)->nullable()->comment('Label from tenant nationalities.name; NationalitySelect value');
            $table->string('marital_status', 32)->nullable()->comment('Staff form: single, married; legacy free-text allowed');
            $table->string('photo_path', 2048)->nullable();

            $table->string('mobile_number', 32)->nullable();
            $table->string('alternate_phone', 32)->nullable();
            $table->string('email', 255)->nullable();
            $table->string('address_line_1', 255)->nullable();
            $table->string('address_line_2', 255)->nullable();
            $table->string('city', 120)->nullable();
            $table->string('state', 120)->nullable();
            $table->string('postcode', 16)->nullable();
            $table->string('country', 120)->nullable();
            $table->string('emergency_contact_name', 255)->nullable();
            $table->string('emergency_contact_phone', 32)->nullable();

            $table->string('employee_number', 64)->nullable();
            $table->date('hire_date')->nullable();
            $table->date('confirmation_date')->nullable();
            $table->string('position', 255)->nullable();
            $table->string('department', 255)->nullable();
            $table->foreignId('reporting_manager_id')->nullable()->constrained('staff')->nullOnDelete();
            $table->string('employment_type', 64)->nullable();
            $table->string('salary_type', 64)->nullable();
            $table->json('assigned_clinics')->nullable();
            $table->string('working_hours', 255)->nullable();
            $table->string('employment_status', 32)->default('active');
            $table->boolean('is_active')->default(true);

            $table->string('medical_registration_number', 64)->nullable();
            $table->string('apc_number', 64)->nullable();
            $table->date('apc_expiry_date')->nullable();
            $table->string('specialization', 255)->nullable();
            $table->text('qualifications')->nullable();
            $table->unsignedTinyInteger('years_experience')->nullable();

            $table->json('documents')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });

        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('staff_id')->nullable()->after('id')->constrained()->nullOnDelete();
        });

        Schema::table('users', function (Blueprint $table) {
            $table->unique('staff_id');
        });

        $users = DB::table('users')->orderBy('id')->get();

        foreach ($users as $user) {
            if ((int) $user->id === 1) {
                continue;
            }

            $staffId = DB::table('staff')->insertGetId([
                'staff_number' => 'STF-TEMP-'.$user->id,
                'full_name' => $user->name,
                'preferred_name' => null,
                'nric_passport' => null,
                'gender' => null,
                'date_of_birth' => null,
                'nationality' => null,
                'marital_status' => null,
                'photo_path' => null,
                'mobile_number' => $user->phone ?? null,
                'alternate_phone' => null,
                'email' => $user->email,
                'address_line_1' => null,
                'address_line_2' => null,
                'city' => null,
                'state' => null,
                'postcode' => null,
                'country' => null,
                'emergency_contact_name' => null,
                'emergency_contact_phone' => null,
                'employee_number' => null,
                'hire_date' => null,
                'confirmation_date' => null,
                'position' => null,
                'department' => null,
                'reporting_manager_id' => null,
                'employment_type' => null,
                'salary_type' => null,
                'assigned_clinics' => null,
                'working_hours' => null,
                'employment_status' => 'active',
                'is_active' => true,
                'medical_registration_number' => $user->mmc_registration_number ?? null,
                'apc_number' => null,
                'apc_expiry_date' => null,
                'specialization' => null,
                'qualifications' => null,
                'years_experience' => null,
                'documents' => null,
                'created_at' => now(),
                'updated_at' => now(),
                'deleted_at' => null,
            ]);

            $staffNumber = 'STF-'.str_pad((string) $staffId, 5, '0', STR_PAD_LEFT);
            DB::table('staff')->where('id', $staffId)->update(['staff_number' => $staffNumber]);

            DB::table('users')->where('id', $user->id)->update(['staff_id' => $staffId]);
        }

        foreach ($users as $user) {
            $staffId = DB::table('users')->where('id', $user->id)->value('staff_id');
            $mmc = DB::table('staff')->where('id', $staffId)->value('medical_registration_number');
            if ($mmc !== null) {
                DB::table('users')->where('id', $user->id)->update(['mmc_registration_number' => $mmc]);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['staff_id']);
            $table->dropColumn('staff_id');
        });

        Schema::dropIfExists('staff');
    }
};
