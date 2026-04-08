<?php

use App\Models\Tenant;
use App\Services\InternalTenantSetupService;
use Illuminate\Support\Facades\Artisan;

test('run fake seeders calls patient seeder for tenant', function () {
    $tenant = new Tenant;
    $tenant->id = 'tenant-123';
    $service = new InternalTenantSetupService;

    Artisan::shouldReceive('call')
        ->once()
        ->with('tenants:artisan', [
            'artisanCommand' => 'db:seed --class=PatientSeeder --database=tenant',
            '--tenant' => ['tenant-123'],
        ])
        ->andReturn(0);

    $service->runFakeSeeders($tenant);
});

test('run fake seeders throws when artisan command fails', function () {
    $tenant = new Tenant;
    $tenant->id = 'tenant-123';
    $service = new InternalTenantSetupService;

    Artisan::shouldReceive('call')
        ->once()
        ->andReturn(1);
    Artisan::shouldReceive('output')
        ->once()
        ->andReturn('Seeder failed');

    expect(fn () => $service->runFakeSeeders($tenant))
        ->toThrow(RuntimeException::class, 'Tenant fake data seeders failed: Seeder failed');
});

test('ensure tenant user returns skipped when command succeeds with empty output', function () {
    $tenant = new Tenant;
    $tenant->id = 'tenant-123';
    $service = new InternalTenantSetupService;

    Artisan::shouldReceive('call')
        ->once()
        ->with('tenants:artisan', [
            'artisanCommand' => 'ensure-tenant-user',
            '--tenant' => ['tenant-123'],
        ])
        ->andReturn(0);
    Artisan::shouldReceive('output')
        ->once()
        ->andReturn('');

    expect($service->ensureTenantUser($tenant))->toBe('skipped');
});
