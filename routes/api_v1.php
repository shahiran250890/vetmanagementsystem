<?php

use App\Http\Controllers\Api\ClinicSpaSupportController;
use App\Modules\Appointments\Http\Controllers\AppointmentApiController;
use App\Modules\Billing\Http\Controllers\BillApiController;
use App\Modules\Billing\Http\Controllers\PaymentApiController;
use App\Modules\Medical\Http\Controllers\MedicalRecordApiController;
use App\Modules\Patients\Http\Controllers\PatientApiController;
use Illuminate\Support\Facades\Route;

Route::get('me', [ClinicSpaSupportController::class, 'me'])->name('me');
Route::get('lookup/doctors', [ClinicSpaSupportController::class, 'doctors'])->name('lookup.doctors');

Route::apiResource('patients', PatientApiController::class);
Route::apiResource('appointments', AppointmentApiController::class);
Route::apiResource('medical-records', MedicalRecordApiController::class);
Route::apiResource('bills', BillApiController::class);
Route::get('payments', [PaymentApiController::class, 'index'])->name('payments.index');
Route::post('payments', [PaymentApiController::class, 'store'])->name('payments.store');
Route::get('payments/{payment}', [PaymentApiController::class, 'show'])->name('payments.show');
