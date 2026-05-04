<?php

namespace App\Modules\Appointments\Listeners;

use App\Models\Appointments\Appointment;
use App\Modules\Appointments\Events\AppointmentCreated;
use App\Modules\Patients\Contracts\PatientAuditLogger;

class RecordAppointmentPatientAudit
{
    public function __construct(
        protected PatientAuditLogger $patientAuditLogger,
    ) {}

    public function handle(AppointmentCreated $event): void
    {
        $appointment = $event->appointment->loadMissing('patient', 'doctor');

        $this->patientAuditLogger->record(
            patientId: $appointment->patient_id,
            action: 'appointment.created',
            referenceType: Appointment::class,
            referenceId: $appointment->id,
            description: sprintf(
                'Appointment scheduled for %s with Dr. %s',
                $appointment->appointment_datetime?->toDateTimeString() ?? '',
                $appointment->doctor?->name ?? '',
            ),
            metadata: [
                'appointment_id' => $appointment->id,
                'doctor_id' => $appointment->doctor_id,
                'type' => $appointment->type?->value,
                'status' => $appointment->status?->value,
            ],
            createdById: null,
        );
    }
}
