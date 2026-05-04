<?php

namespace App\Providers;

use App\Contracts\Clinic\ClinicContext;
use App\Models\Appointments\Appointment;
use App\Models\Billing\Bill;
use App\Models\Billing\Payment;
use App\Models\Medical\MedicalRecord;
use App\Models\Patients\Patient;
use App\Modules\Appointments\Events\AppointmentCreated;
use App\Modules\Appointments\Listeners\RecordAppointmentPatientAudit;
use App\Modules\Appointments\Policies\AppointmentPolicy;
use App\Modules\Billing\Events\BillGenerated;
use App\Modules\Billing\Events\PaymentReceived;
use App\Modules\Billing\Listeners\RecordBillPatientAudit;
use App\Modules\Billing\Listeners\RecordPaymentPatientAudit;
use App\Modules\Billing\Policies\BillPolicy;
use App\Modules\Billing\Policies\PaymentPolicy;
use App\Modules\Medical\Events\MedicalRecordCreated;
use App\Modules\Medical\Listeners\RecordMedicalRecordPatientAudit;
use App\Modules\Medical\Policies\MedicalRecordPolicy;
use App\Modules\Patients\Contracts\PatientAuditLogger;
use App\Modules\Patients\Contracts\PatientOwnerDirectory;
use App\Modules\Patients\Contracts\PatientReadRepository;
use App\Modules\Patients\Contracts\SpeciesBreedCatalog;
use App\Modules\Patients\Infrastructure\EloquentPatientAuditLogger;
use App\Modules\Patients\Infrastructure\EloquentPatientOwnerDirectory;
use App\Modules\Patients\Infrastructure\EloquentPatientReadRepository;
use App\Modules\Patients\Infrastructure\EloquentSpeciesBreedCatalog;
use App\Modules\Patients\Policies\PatientPolicy;
use App\Modules\Settings\Infrastructure\EloquentClinicContext;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->scoped(ClinicContext::class, EloquentClinicContext::class);
        $this->app->scoped(PatientOwnerDirectory::class, EloquentPatientOwnerDirectory::class);
        $this->app->scoped(SpeciesBreedCatalog::class, EloquentSpeciesBreedCatalog::class);
        $this->app->scoped(PatientAuditLogger::class, EloquentPatientAuditLogger::class);
        $this->app->scoped(PatientReadRepository::class, EloquentPatientReadRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::policy(Patient::class, PatientPolicy::class);
        Gate::policy(Appointment::class, AppointmentPolicy::class);
        Gate::policy(MedicalRecord::class, MedicalRecordPolicy::class);
        Gate::policy(Bill::class, BillPolicy::class);
        Gate::policy(Payment::class, PaymentPolicy::class);

        Event::listen(AppointmentCreated::class, RecordAppointmentPatientAudit::class);
        Event::listen(MedicalRecordCreated::class, RecordMedicalRecordPatientAudit::class);
        Event::listen(BillGenerated::class, RecordBillPatientAudit::class);
        Event::listen(PaymentReceived::class, RecordPaymentPatientAudit::class);

        $this->configureDefaults();
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
