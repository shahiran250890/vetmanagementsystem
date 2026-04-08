<?php

use App\Http\Controllers\Patients\PatientController;
use App\Http\Controllers\Patients\PatientHistoryController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->prefix('patients')->name('patients.')->group(function (): void {
    Route::get('/', [PatientController::class, 'index'])->name('index');
    Route::get('/create', [PatientController::class, 'create'])->name('create');
    Route::post('/', [PatientController::class, 'store'])->name('store');
    Route::get('/{patient}', [PatientController::class, 'show'])->name('show');
    Route::get('/{patient}/edit', [PatientController::class, 'edit'])->name('edit');
    Route::put('/{patient}', [PatientController::class, 'update'])->name('update');
    Route::delete('/{patient}', [PatientController::class, 'destroy'])->name('destroy');
    Route::post('/{patient}/history', [PatientHistoryController::class, 'store'])->name('history.store');
});
