<?php

test('patient routes are isolated in dedicated route file', function () {
    $patientsRoutes = file_get_contents(base_path('routes/patients.php'));
    $webRoutes = file_get_contents(base_path('routes/web.php'));

    expect($patientsRoutes)->toContain("prefix('patients')");
    expect($webRoutes)->not->toContain('patients.');
    expect($webRoutes)->not->toContain('/patients');
});

test('patient controllers avoid direct coupling to other modules', function () {
    $patientController = file_get_contents(
        app_path('Http/Controllers/Patients/PatientController.php'),
    );

    $historyController = file_get_contents(
        app_path('Http/Controllers/Patients/PatientHistoryController.php'),
    );

    expect($patientController)->not->toContain('Appointment');
    expect($patientController)->not->toContain('Billing');
    expect($patientController)->not->toContain('Inventory');
    expect($historyController)->not->toContain('Appointment');
    expect($historyController)->not->toContain('Billing');
    expect($historyController)->not->toContain('Inventory');
});
