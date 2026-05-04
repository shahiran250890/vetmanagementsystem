<?php

namespace App\Modules\Billing\Listeners;

use App\Models\Billing\Bill;
use App\Modules\Billing\Events\BillGenerated;
use App\Modules\Patients\Contracts\PatientAuditLogger;

class RecordBillPatientAudit
{
    public function __construct(
        protected PatientAuditLogger $patientAuditLogger,
    ) {}

    public function handle(BillGenerated $event): void
    {
        $bill = $event->bill->loadMissing('patient');

        $this->patientAuditLogger->record(
            patientId: $bill->patient_id,
            action: 'bill.generated',
            referenceType: Bill::class,
            referenceId: $bill->id,
            description: sprintf('Bill #%d for %s total %s', $bill->id, $bill->patient?->name ?? 'patient', (string) $bill->total_amount),
            metadata: [
                'bill_id' => $bill->id,
                'total_amount' => (string) $bill->total_amount,
                'status' => $bill->status?->value ?? (string) $bill->status,
            ],
            createdById: null,
        );
    }
}
