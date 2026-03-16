<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Tests\TestCase;

beforeEach(function () {
    Config::set('database.connections.landlord', [
        'driver' => 'sqlite',
        'database' => ':memory:',
        'prefix' => '',
        'foreign_key_constraints' => true,
    ]);

    Config::set('multitenancy.landlord_database_connection_name', 'landlord');
    Config::set('multitenancy.tenant_database_connection_name', 'landlord');
    Config::set('multitenancy.switch_tenant_tasks', []);

    Schema::connection('landlord')->create('tenants', function (Blueprint $table): void {
        $table->uuid('id')->primary();
        $table->string('subscription_plan_id')->nullable();
        $table->string('name');
        $table->string('database_name')->unique();
        $table->string('database_username');
        $table->string('database_password')->nullable();
        $table->string('database_host')->nullable();
        $table->integer('database_port')->nullable();
        $table->boolean('is_enabled')->default(true);
        $table->timestamps();
    });

    Schema::connection('landlord')->create('domains', function (Blueprint $table): void {
        $table->id();
        $table->uuid('tenant_id');
        $table->string('domain')->unique();
        $table->timestamps();
    });
});

test('blocks access when no tenant matches host', function () {
    /** @var TestCase $this */
    $this->withServerVariables(['HTTP_HOST' => 'unknown.vetmanagementsystem.test'])
        ->get('/')
        ->assertNotFound();
});

test('blocks access when tenant is disabled', function () {
    /** @var TestCase $this */
    $tenantId = (string) Str::uuid();

    DB::connection('landlord')->table('tenants')->insert([
        'id' => $tenantId,
        'subscription_plan_id' => null,
        'name' => 'Acme',
        'database_name' => 'acme_db',
        'database_username' => 'root',
        'database_password' => null,
        'database_host' => null,
        'database_port' => null,
        'is_enabled' => 0,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    DB::connection('landlord')->table('domains')->insert([
        'tenant_id' => $tenantId,
        'domain' => 'vetmanagementsystem.test',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $this->withServerVariables(['HTTP_HOST' => 'vetmanagementsystem.test'])
        ->get('/')
        ->assertNotFound();
});

test('allows access when tenant is enabled', function () {
    /** @var TestCase $this */
    $tenantId = (string) Str::uuid();

    DB::connection('landlord')->table('tenants')->insert([
        'id' => $tenantId,
        'subscription_plan_id' => null,
        'name' => 'Acme',
        'database_name' => 'acme_db',
        'database_username' => 'root',
        'database_password' => null,
        'database_host' => null,
        'database_port' => null,
        'is_enabled' => 1,
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    DB::connection('landlord')->table('domains')->insert([
        'tenant_id' => $tenantId,
        'domain' => 'vetmanagementsystem.test',
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    $this->withServerVariables(['HTTP_HOST' => 'vetmanagementsystem.test'])
        ->get('/')
        ->assertOk();
});
