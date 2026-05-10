<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('medical_records')) {
            return;
        }

        Schema::table('medical_records', function (Blueprint $table): void {
            if (! Schema::hasColumn('medical_records', 'symptoms')) {
                $table->text('symptoms')->nullable();
            }

            if (! Schema::hasColumn('medical_records', 'diagnosis')) {
                $table->text('diagnosis')->nullable();
            }
        });
    }

    public function down(): void
    {
        if (! Schema::hasTable('medical_records')) {
            return;
        }

        Schema::table('medical_records', function (Blueprint $table): void {
            if (Schema::hasColumn('medical_records', 'symptoms')) {
                $table->dropColumn('symptoms');
            }

            if (Schema::hasColumn('medical_records', 'diagnosis')) {
                $table->dropColumn('diagnosis');
            }
        });
    }
};
