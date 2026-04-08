<?php

use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('patient_history_entries', function (Blueprint $table) {
            $table->string('visit_case_number')->nullable()->after('created_by');
            $table->dateTime('visit_at')->nullable()->after('entry_date');
            $table->string('clinic_location')->nullable()->after('visit_at');
            $table->foreignIdFor(User::class, 'veterinarian_user_id')->nullable()->after('clinic_location')->constrained('users')->nullOnDelete();
            $table->foreignIdFor(User::class, 'assistant_user_id')->nullable()->after('veterinarian_user_id')->constrained('users')->nullOnDelete();
            $table->string('visit_type')->nullable()->after('assistant_user_id');
            $table->string('appointment_id')->nullable()->after('visit_type');
            $table->string('visit_status')->nullable()->after('appointment_id');

            $table->index(['visit_type', 'visit_status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('patient_history_entries', function (Blueprint $table) {
            $table->dropForeign(['veterinarian_user_id']);
            $table->dropForeign(['assistant_user_id']);
            $table->dropIndex(['visit_type', 'visit_status']);
            $table->dropColumn([
                'visit_case_number',
                'visit_at',
                'clinic_location',
                'veterinarian_user_id',
                'assistant_user_id',
                'visit_type',
                'appointment_id',
                'visit_status',
            ]);
        });
    }
};
