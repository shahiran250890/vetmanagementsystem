<?php

namespace App\Console\Commands;

use App\Models\Tenant;
use App\Models\User;
use Database\Seeders\UserSeeder;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class EnsureTenantUserCommand extends Command
{
    /**
     * The name and signature of the console command.
     * Run in tenant context via: tenants:artisan "ensure-tenant-user" --tenant=<id>
     *
     * @var string
     */
    protected $signature = 'ensure-tenant-user';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Ensure the tenant has at least one user; runs UserSeeder if the users table is empty.';

    /**
     * Execute the console command.
     * Outputs "seeded" or "skipped" on success; "no-tenant" and exit failure if not run in tenant context.
     */
    public function handle(): int
    {
        $currentTenant = Tenant::current();

        Log::info('ensure-tenant-user: started', [
            'current_tenant_id' => $currentTenant?->getKey(),
            'current_tenant_name' => $currentTenant?->name ?? null,
            'has_tenant_context' => $currentTenant !== null,
        ]);

        if ($currentTenant === null) {
            Log::warning('ensure-tenant-user: no tenant context');
            $this->line('no-tenant');

            return self::FAILURE;
        }

        $tenantConnection = config('multitenancy.tenant_database_connection_name', 'tenant');
        DB::purge($tenantConnection);

        $databaseName = config("database.connections.{$tenantConnection}.database");
        $userCount = User::on($tenantConnection)->count();

        Log::info('ensure-tenant-user: tenant connection check', [
            'tenant_connection' => $tenantConnection,
            'database_name' => $databaseName,
            'tenant_database_name_expected' => $currentTenant->getDatabaseName(),
            'users_table_count' => $userCount,
        ]);

        if ($userCount > 0) {
            Log::info('ensure-tenant-user: skipping (users already exist)');
            $this->line('skipped');

            return self::SUCCESS;
        }

        try {
            $this->call('db:seed', [
                '--class' => UserSeeder::class,
                '--database' => $tenantConnection,
            ]);
        } catch (\Throwable $e) {
            Log::error('ensure-tenant-user: seeder failed', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            $this->error($e->getMessage());

            return self::FAILURE;
        }

        Log::info('ensure-tenant-user: seeded successfully');
        $this->line('seeded');

        return self::SUCCESS;
    }
}
