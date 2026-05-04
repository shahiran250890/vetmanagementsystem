<?php

use App\Modules\Settings\Http\Controllers\OrganizationProfileController;
use App\Modules\Settings\Http\Controllers\PermissionController;
use App\Modules\Settings\Http\Controllers\ProfileController;
use App\Modules\Settings\Http\Controllers\RoleController;
use App\Modules\Settings\Http\Controllers\SecurityController;
use App\Modules\Settings\Http\Controllers\SpeciesController;
use App\Modules\Settings\Http\Controllers\SystemSettingController;
use App\Modules\Settings\Http\Controllers\UserManagementController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    Route::redirect('settings', '/settings/profile');

    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::delete('settings/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('settings/security', [SecurityController::class, 'edit'])->name('security.edit');

    Route::put('settings/password', [SecurityController::class, 'update'])
        ->middleware('throttle:6,1')
        ->name('user-password.update');

    Route::inertia('settings/appearance', 'settings/appearance')->name('appearance.edit');

    Route::prefix('settings/system')->name('settings.system.')->group(function (): void {
        Route::inertia('/', 'settings/system/index')->name('index');
        Route::patch('users/{managed_user}/status', [UserManagementController::class, 'toggleStatus'])
            ->name('users.toggle-status');
        Route::resource('system-settings', SystemSettingController::class)
            ->except(['show']);
        Route::resource('users', UserManagementController::class)
            ->parameters(['users' => 'managed_user']);
        Route::resource('species', SpeciesController::class);
        Route::resource('roles', RoleController::class);
        Route::resource('permissions', PermissionController::class);
        Route::get('organization', [OrganizationProfileController::class, 'edit'])
            ->name('organization.edit');
        Route::put('organization', [OrganizationProfileController::class, 'update'])
            ->name('organization.update');
    });
});
