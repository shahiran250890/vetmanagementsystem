<?php

namespace App\Modules\Billing\Listeners;

use App\Models\Billing\Payment;
use App\Modules\Billing\Events\PaymentReceived;
use App\Modules\Patients\Contracts\PatientAuditLogger;

class RecordPaymentPatientAudit
{
    public function __construct(
        protected PatientAuditLogger $patientAuditLogger,
    ) {}

    public function handle(PaymentReceived $event): void
    {
        $payment = $event->payment->loadMissing('bill.patient');

        $patientId = $payment->bill?->patient_id;
        if ($patientId === null) {
            return;
        }

        $this->patientAuditLogger->record(
            patientId: $patientId,
            action: 'payment.received',
            referenceType: Payment::class,
            referenceId: $payment->id,
            description: sprintf('Payment of %s via %s', (string) $payment->amount, $payment->method),
            metadata: [
                'payment_id' => $payment->id,
                'bill_id' => $payment->bill_id,
                'amount' => (string) $payment->amount,
                'method' => $payment->method,
            ],
            createdById: null,
        );
    }
}
