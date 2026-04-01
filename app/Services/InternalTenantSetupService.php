<?php

namespace App\Services;

use App\Models\Tenant;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use RuntimeException;

class InternalTenantSetupService
{
    public function createDatabase(Tenant $tenant): void
    {
        $connectionName = 'tenant_internal_setup_'.str_replace('-', '_', $tenant->id);

        Config::set('database.connections.'.$connectionName, [
            'driver' => 'mysql',
            'host' => $tenant->database_host ?? '127.0.0.1',
            'port' => $tenant->database_port ?? 3306,
            'database' => 'mysql',
            'username' => $tenant->database_username,
            'password' => $tenant->database_password ?? '',
            'charset' => 'utf8mb4',
            'collation' => 'utf8mb4_unicode_ci',
            'strict' => true,
            'engine' => null,
        ]);

        $databaseName = str_replace('`', '``', $tenant->database_name);
        DB::connection($connectionName)->statement("CREATE DATABASE IF NOT EXISTS `{$databaseName}`");

        DB::purge($connectionName);
        Config::set('database.connections.'.$connectionName, null);
    }

    public function runMigrations(Tenant $tenant): void
    {
        $exitCode = Artisan::call('tenants:artisan', [
            'artisanCommand' => 'migrate --path=database/migrations/tenant --database=tenant',
            '--tenant' => [$tenant->id],
        ]);

        if ($exitCode !== 0) {
            throw new RuntimeException('Tenant migrations failed: '.trim(Artisan::output()));
        }
    }

    public function runSeeders(Tenant $tenant): void
    {
        $exitCode = Artisan::call('tenants:artisan', [
            'artisanCommand' => 'db:seed --database=tenant',
            '--tenant' => [$tenant->id],
        ]);

        if ($exitCode !== 0) {
            throw new RuntimeException('Tenant seeders failed: '.trim(Artisan::output()));
        }
    }

    public function ensureTenantUser(Tenant $tenant): string
    {
        $exitCode = Artisan::call('tenants:artisan', [
            'artisanCommand' => 'ensure-tenant-user',
            '--tenant' => [$tenant->id],
        ]);

        $output = trim(Artisan::output());
        $lastLine = str_contains($output, "\n") ? trim(substr($output, strrpos($output, "\n") + 1)) : $output;

        if ($exitCode !== 0 || ! in_array($lastLine, ['seeded', 'skipped'], true)) {
            throw new RuntimeException('Ensure tenant user failed: '.$output);
        }

        return $lastLine;
    }
}
