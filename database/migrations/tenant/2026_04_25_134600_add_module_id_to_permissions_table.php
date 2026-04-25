<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        $permissionTable = config('permission.table_names.permissions', 'permissions');

        if (! Schema::hasTable('modules') || ! Schema::hasTable($permissionTable)) {
            return;
        }

        if (! Schema::hasColumn($permissionTable, 'module_id')) {
            Schema::table($permissionTable, function (Blueprint $table): void {
                $table->foreignId('module_id')
                    ->nullable()
                    ->after('guard_name')
                    ->constrained('modules')
                    ->nullOnDelete();
            });
        }

        $settingsModuleId = DB::table('modules')->where('key', 'settings')->value('id');

        if ($settingsModuleId === null) {
            $settingsModuleId = DB::table('modules')->insertGetId([
                'name' => 'System Setting',
                'key' => 'settings',
                'is_enabled' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        DB::table($permissionTable)->whereNull('module_id')->update([
            'module_id' => $settingsModuleId,
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        $permissionTable = config('permission.table_names.permissions', 'permissions');

        if (! Schema::hasTable($permissionTable) || ! Schema::hasColumn($permissionTable, 'module_id')) {
            return;
        }

        Schema::table($permissionTable, function (Blueprint $table): void {
            $table->dropConstrainedForeignId('module_id');
        });
    }
};
