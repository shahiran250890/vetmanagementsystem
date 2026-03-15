<?php

use Spatie\Multitenancy\Jobs\TenantAware;
use Illuminate\Broadcasting\BroadcastEvent;
use Illuminate\Events\CallQueuedListener;
use Illuminate\Mail\SendQueuedMailable;
use Spatie\Multitenancy\Jobs\NotTenantAware;
use Illuminate\Notifications\SendQueuedNotifications;
use Illuminate\Queue\CallQueuedClosure;
use Spatie\Multitenancy\Actions\ForgetCurrentTenantAction;
use Spatie\Multitenancy\Actions\MakeQueueTenantAwareAction;
use Spatie\Multitenancy\Actions\MakeTenantCurrentAction;
use Spatie\Multitenancy\Actions\MigrateTenantAction;
use App\Models\Tenant;
use App\Multitenancy\EnsureTenantDatabaseExistsTask;
use App\Multitenancy\FindTenantByDomain;
use Spatie\Multitenancy\Tasks\SwitchTenantDatabaseTask;

return [
    /*
     * Resolves the current tenant by looking up the request host in the domains table
     * (one tenant, many domains).
     */
    'tenant_finder' => FindTenantByDomain::class,

    'tenant_artisan_search_fields' => [
        'id',
    ],

    /*
     * Tasks run when switching tenant. EnsureTenantDatabaseExistsTask creates the
     * tenant database if it doesn't exist; SwitchTenantDatabaseTask switches the
     * connection to it.
     */
    'switch_tenant_tasks' => [
        EnsureTenantDatabaseExistsTask::class,
        SwitchTenantDatabaseTask::class,
    ],

    'tenant_model' => Tenant::class,

    'queues_are_tenant_aware_by_default' => true,

    /*
     * Connection used for tenant databases. The actual database name is set at
     * runtime from the tenant's `database` attribute.
     */
    'tenant_database_connection_name' => env('TENANT_DB_CONNECTION', 'tenant'),

    /*
     * Landlord DB stores the list of tenants (tenants table) and any central data.
     */
    'landlord_database_connection_name' => env('LANDLORD_DB_CONNECTION', 'landlord'),

    'current_tenant_context_key' => 'tenantId',

    'current_tenant_container_key' => 'currentTenant',

    'shared_routes_cache' => false,

    'actions' => [
        'make_tenant_current_action' => MakeTenantCurrentAction::class,
        'forget_current_tenant_action' => ForgetCurrentTenantAction::class,
        'make_queue_tenant_aware_action' => MakeQueueTenantAwareAction::class,
        'migrate_tenant' => MigrateTenantAction::class,
    ],

    'queueable_to_job' => [
        SendQueuedMailable::class => 'mailable',
        SendQueuedNotifications::class => 'notification',
        CallQueuedClosure::class => 'closure',
        CallQueuedListener::class => 'class',
        BroadcastEvent::class => 'event',
    ],

    'tenant_aware_interface' => TenantAware::class,

    'not_tenant_aware_interface' => NotTenantAware::class,

    'tenant_aware_jobs' => [
        // ...
    ],

    'not_tenant_aware_jobs' => [
        // ...
    ],
];
