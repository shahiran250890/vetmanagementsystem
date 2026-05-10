<?php

use App\ViewModels\DashboardWidgets;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::inertia('/', 'welcome')->name('home');

Route::get('/login/access-denied', fn () => Inertia::render('auth/access-denied'))->name('login.access-denied');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function (Request $request) {
        return Inertia::render('dashboard/index', [
            'dashboardWidgets' => DashboardWidgets::visibleFor($request->user()),
        ]);
    })->name('dashboard');
});

Route::get('clinic', fn () => redirect()->route('dashboard'))->name('clinic.redirect');
Route::get('clinic/{any}', fn () => redirect()->route('dashboard'))->where('any', '.*');

require __DIR__.'/clinical.php';
require __DIR__.'/settings.php';
require __DIR__.'/patients.php';
