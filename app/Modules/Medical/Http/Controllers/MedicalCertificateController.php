<?php

namespace App\Modules\Medical\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Medical\MedicalCertificate;
use App\Models\Patients\Patient;
use App\Models\Settings\OrganizationProfile;
use App\Modules\Medical\Application\Services\MedicalCertificateService;
use App\Modules\Medical\Http\Requests\StoreMedicalCertificateRequest;
use App\Modules\Medical\Http\Requests\VoidMedicalCertificateRequest;
use App\Modules\Patients\Http\Resources\PatientResource;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Illuminate\View\View;
use Inertia\Inertia;
use Inertia\Response;

class MedicalCertificateController extends Controller
{
    public function __construct(
        protected MedicalCertificateService $medicalCertificateService,
    ) {}

    public function create(Patient $patient): Response
    {
        $this->authorize('create', MedicalCertificate::class);

        if ($this->issuanceBlockedForPatient($patient)) {
            abort(403);
        }

        $patient->load([
            'humanProfile',
            'medicalRecords' => fn ($query) => $query->latest()->limit(50),
        ]);

        return Inertia::render('patients/medical-certificates/create', [
            'patient' => PatientResource::make($patient)->resolve(),
            'medicalRecordOptions' => $patient->medicalRecords->map(fn ($record): array => [
                'id' => $record->id,
                'label' => '#'.$record->id.' — '.($record->diagnosis ? Str::limit($record->diagnosis, 60) : 'No diagnosis'),
            ])->all(),
        ]);
    }

    public function store(StoreMedicalCertificateRequest $request, Patient $patient): RedirectResponse
    {
        $user = $request->user();
        if ($user === null) {
            abort(403);
        }

        $certificate = $this->medicalCertificateService->issue($patient, $user, $request->validated());

        return redirect()->route('patients.show', $patient)
            ->with('flash_medical_certificate_id', $certificate->id);
    }

    public function print(Patient $patient, MedicalCertificate $medicalCertificate): View
    {
        $this->assertCertificateBelongsToPatient($patient, $medicalCertificate);
        $this->authorize('view', $medicalCertificate);

        $medicalCertificate->load(['patient.humanProfile', 'doctor']);
        $organization = OrganizationProfile::query()->first();

        return view('medical-certificates.print', [
            'certificate' => $medicalCertificate,
            'organization' => $organization,
        ]);
    }

    public function void(VoidMedicalCertificateRequest $request, Patient $patient, MedicalCertificate $medicalCertificate): RedirectResponse
    {
        $this->assertCertificateBelongsToPatient($patient, $medicalCertificate);

        $user = $request->user();
        if ($user === null) {
            abort(403);
        }

        $this->medicalCertificateService->void(
            $medicalCertificate,
            $user,
            (string) $request->validated('void_reason'),
        );

        return to_route('patients.show', $patient);
    }

    protected function issuanceBlockedForPatient(Patient $patient): bool
    {
        if ($patient->patient_type !== 'human') {
            return true;
        }

        return OrganizationProfile::query()->value('clinic_type') === 'vet';
    }

    protected function assertCertificateBelongsToPatient(Patient $patient, MedicalCertificate $medicalCertificate): void
    {
        abort_if($medicalCertificate->patient_id !== $patient->id, 404);
    }
}
