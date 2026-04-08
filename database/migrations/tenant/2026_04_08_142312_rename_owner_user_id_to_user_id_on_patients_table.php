<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (! Schema::hasTable('patients')) {
            return;
        }

        if (Schema::hasColumn('patients', 'owner_user_id') && ! Schema::hasColumn('patients', 'user_id')) {
            DB::statement('ALTER TABLE patients DROP FOREIGN KEY patients_owner_user_id_foreign');
            DB::statement('ALTER TABLE patients CHANGE owner_user_id user_id BIGINT UNSIGNED NULL');
            DB::statement('ALTER TABLE patients ADD CONSTRAINT patients_user_id_foreign FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL');
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (! Schema::hasTable('patients')) {
            return;
        }

        if (Schema::hasColumn('patients', 'user_id') && ! Schema::hasColumn('patients', 'owner_user_id')) {
            DB::statement('ALTER TABLE patients DROP FOREIGN KEY patients_user_id_foreign');
            DB::statement('ALTER TABLE patients CHANGE user_id owner_user_id BIGINT UNSIGNED NULL');
            DB::statement('ALTER TABLE patients ADD CONSTRAINT patients_owner_user_id_foreign FOREIGN KEY (owner_user_id) REFERENCES users(id) ON DELETE SET NULL');
        }
    }
};
