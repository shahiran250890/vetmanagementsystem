<?php

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
        if (Schema::hasTable('patient_history_entries')) {
            return;
        }

        Schema::create('patient_history_entries', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('patient_id');
            $table->unsignedBigInteger('created_by')->nullable();
            $table->date('entry_date');
            $table->string('entry_type')->nullable();
            $table->string('title');
            $table->text('details');
            $table->timestamps();

            $table->index(['patient_id', 'entry_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('patient_history_entries')) {
            Schema::drop('patient_history_entries');
        }
    }
};
