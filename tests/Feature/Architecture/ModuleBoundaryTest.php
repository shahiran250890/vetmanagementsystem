<?php

use Symfony\Component\Finder\Finder;

test('patients http layer does not import settings models directly', function () {
    $finder = Finder::create()
        ->files()
        ->in([app_path('Modules/Patients/Http/Controllers'), app_path('Modules/Patients/Http/Requests')])
        ->name('*.php');

    foreach ($finder as $file) {
        $contents = $file->getContents();
        expect($contents)->not->toContain('use App\Models\Settings\\')
            ->and($contents)->not->toContain('OrganizationProfile::');
    }
});

test('settings http layer does not import patients models directly', function () {
    $finder = Finder::create()
        ->files()
        ->in(app_path('Modules/Settings/Http/Controllers'))
        ->name('*.php');

    foreach ($finder as $file) {
        $contents = $file->getContents();
        expect($contents)->not->toContain('use App\Models\Patients\\');
    }
});

test('patient controller uses module contracts instead of settings user models', function () {
    $contents = file_get_contents(app_path('Modules/Patients/Http/Controllers/PatientController.php'));

    expect($contents)->toContain('ClinicContext')
        ->and($contents)->toContain('PatientOwnerDirectory')
        ->and($contents)->toContain('SpeciesBreedCatalog')
        ->and($contents)->not->toContain('use App\Models\Settings\\')
        ->and($contents)->not->toContain('use App\Models\User;');
});
