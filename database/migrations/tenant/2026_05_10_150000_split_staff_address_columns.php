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
        if (! Schema::hasTable('staff')) {
            return;
        }

        if (! Schema::hasColumn('staff', 'address_line_1')) {
            Schema::table('staff', function (Blueprint $table): void {
                $table->string('address_line_1', 255)->nullable()->after('email');
                $table->string('address_line_2', 255)->nullable()->after('address_line_1');
                $table->string('city', 120)->nullable()->after('address_line_2');
                $table->string('state', 120)->nullable()->after('city');
                $table->string('postcode', 16)->nullable()->after('state');
                $table->string('country', 120)->nullable()->after('postcode');
            });
        }

        if (Schema::hasColumn('staff', 'address')) {
            DB::table('staff')
                ->whereNotNull('address')
                ->update(['address_line_1' => DB::raw('address')]);

            Schema::table('staff', function (Blueprint $table): void {
                $table->dropColumn('address');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (! Schema::hasTable('staff')) {
            return;
        }

        if (Schema::hasColumn('staff', 'address_line_1') && ! Schema::hasColumn('staff', 'address')) {
            Schema::table('staff', function (Blueprint $table): void {
                $table->text('address')->nullable()->after('email');
            });

            DB::table('staff')
                ->whereNotNull('address_line_1')
                ->update(['address' => DB::raw('address_line_1')]);
        }

        if (Schema::hasColumn('staff', 'address_line_1')) {
            Schema::table('staff', function (Blueprint $table): void {
                $table->dropColumn([
                    'address_line_1',
                    'address_line_2',
                    'city',
                    'state',
                    'postcode',
                    'country',
                ]);
            });
        }
    }
};
