<?php

use App\Http\Controllers\Internal\TenantSetupController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:admin|superadmin|doctor|receptionist|nurse'])
    ->prefix('v1')
    ->name('api.v1.')
    ->group(base_path('routes/api_v1.php'));

Route::prefix('internal/tenant-setup')
    ->group(function () {
        Route::post('token', [TenantSetupController::class, 'issueAccessToken'])
            ->middleware(['internal.setup.client']);

        Route::middleware(['internal.setup.auth'])->group(function () {
            Route::post('tenants/{tenant}/database', [TenantSetupController::class, 'createDatabase']);
            Route::post('tenants/{tenant}/migrations', [TenantSetupController::class, 'runMigrations']);
            Route::post('tenants/{tenant}/seeders', [TenantSetupController::class, 'runSeeders']);
            Route::post('tenants/{tenant}/fake-seeders', [TenantSetupController::class, 'runFakeSeeders']);
            Route::post('tenants/{tenant}/ensure-user', [TenantSetupController::class, 'ensureUser']);
        });
    });
