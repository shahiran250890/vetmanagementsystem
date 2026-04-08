<?php

use App\Http\Controllers\Settings\PermissionController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\RoleController;
use App\Http\Controllers\Settings\SecurityController;
use App\Http\Controllers\Settings\SpeciesController;
use App\Http\Controllers\Settings\SystemSettingController;
use App\Http\Controllers\Settings\UserManagementController;
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
            ->except(['show'])
            ->parameters(['users' => 'managed_user']);
        Route::resource('species', SpeciesController::class)
            ->except(['show']);
        Route::resource('roles', RoleController::class)
            ->except(['show']);
        Route::resource('permissions', PermissionController::class)
            ->except(['show']);
    });
});
