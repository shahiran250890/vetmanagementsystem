<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified', 'role:admin|superadmin|doctor|receptionist'])->group(function (): void {
    Route::get('/appointments', fn () => Inertia::render('appointments/index'))->name('appointments.index');
    Route::get('/appointments/create', fn () => Inertia::render('appointments/form'))->name('appointments.create');
    Route::get('/appointments/{id}/edit', function (string $id) {
        return Inertia::render('appointments/form', [
            'appointmentId' => (int) $id,
        ]);
    })->whereNumber('id')->name('appointments.edit');
});

Route::middleware(['auth', 'verified', 'role:admin|superadmin|doctor'])->group(function (): void {
    Route::get('/medical-records', fn () => Inertia::render('medical-records/index'))->name('medical-records.index');
    Route::get('/medical-records/create', fn () => Inertia::render('medical-records/form'))->name('medical-records.create');
    Route::get('/medical-records/{id}', function (string $id) {
        return Inertia::render('medical-records/show', [
            'medicalRecordId' => (int) $id,
        ]);
    })->whereNumber('id')->name('medical-records.show');
    Route::get('/medical-records/{id}/edit', function (string $id) {
        return Inertia::render('medical-records/form', [
            'medicalRecordId' => (int) $id,
        ]);
    })->whereNumber('id')->name('medical-records.edit');
});

Route::middleware(['auth', 'verified', 'role:admin|superadmin|receptionist'])->group(function (): void {
    Route::get('/bills', fn () => Inertia::render('bills/index'))->name('bills.index');
    Route::get('/bills/create', fn () => Inertia::render('bills/new'))->name('bills.create');
    Route::get('/bills/{id}', function (string $id) {
        return Inertia::render('bills/show', [
            'billId' => (int) $id,
        ]);
    })->whereNumber('id')->name('bills.show');
    Route::get('/bills/{id}/pay', function (string $id) {
        return Inertia::render('bills/payment', [
            'billId' => (int) $id,
        ]);
    })->whereNumber('id')->name('bills.pay');
});
