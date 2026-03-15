<?php

namespace App\Multitenancy;

use Illuminate\Support\Facades\DB;
use Spatie\Multitenancy\Contracts\IsTenant;
use Spatie\Multitenancy\Tasks\SwitchTenantTask;

class EnsureTenantDatabaseExistsTask implements SwitchTenantTask
{
    public function makeCurrent(IsTenant $tenant): void
    {
        $database = $tenant->getDatabaseName();

        $connection = config('multitenancy.landlord_database_connection_name');

        DB::connection($connection)->statement(
            'CREATE DATABASE IF NOT EXISTS `'.str_replace('`', '``', $database).'`'
        );
    }

    public function forgetCurrent(): void
    {
        // Nothing to do when forgetting tenant.
    }
}
