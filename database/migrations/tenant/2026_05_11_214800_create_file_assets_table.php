<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('file_assets', function (Blueprint $table): void {
            $table->uuid('id')->primary();
            $table->string('module_name', 120);
            $table->string('record_id', 120)->nullable();
            $table->string('category', 120)->nullable();
            $table->string('disk', 64)->default('local');
            $table->string('path', 2048);
            $table->string('original_name', 255);
            $table->string('stored_name', 255);
            $table->string('mime_type', 191)->nullable();
            $table->unsignedBigInteger('size_bytes')->default(0);
            $table->foreignId('uploaded_by_user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->json('meta')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['module_name', 'record_id']);
            $table->index(['module_name', 'category']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('file_assets');
    }
};
