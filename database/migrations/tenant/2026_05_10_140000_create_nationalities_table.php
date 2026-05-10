<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Reference list for nationality / country-of-origin pickers (tenant DB).
     */
    public function up(): void
    {
        Schema::create('nationalities', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->char('iso3166_alpha2', 2)->nullable()->unique();
            $table->unsignedSmallInteger('sort_order')->default(1000);
            $table->timestamps();

            $table->unique('name');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('nationalities');
    }
};
