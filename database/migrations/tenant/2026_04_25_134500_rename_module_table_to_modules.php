<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('modules') && Schema::hasTable('module')) {
            Schema::rename('module', 'modules');
        }
    }

    public function down(): void
    {
        if (! Schema::hasTable('module') && Schema::hasTable('modules')) {
            Schema::rename('modules', 'module');
        }
    }
};
