<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('blood_types', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->timestamps();
        });

        $now = now();
        $bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

        DB::table('blood_types')->insert(
            array_map(
                fn (string $name): array => [
                    'name' => $name,
                    'created_at' => $now,
                    'updated_at' => $now,
                ],
                $bloodTypes,
            ),
        );
    }

    public function down(): void
    {
        Schema::dropIfExists('blood_types');
    }
};
