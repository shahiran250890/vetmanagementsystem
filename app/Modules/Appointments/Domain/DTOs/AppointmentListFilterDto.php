<?php

namespace App\Modules\Appointments\Domain\DTOs;

use Illuminate\Http\Request;

final readonly class AppointmentListFilterDto
{
    public function __construct(
        public ?int $patientId = null,
        public ?int $doctorId = null,
        public ?string $status = null,
        public ?string $fromDate = null,
        public ?string $toDate = null,
        public int $perPage = 15,
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            patientId: $request->integer('patient_id') ?: null,
            doctorId: $request->integer('doctor_id') ?: null,
            status: $request->string('status')->toString() ?: null,
            fromDate: $request->filled('from_date') ? $request->string('from_date')->toString() : null,
            toDate: $request->filled('to_date') ? $request->string('to_date')->toString() : null,
            perPage: min(100, max(1, (int) $request->input('per_page', 15))),
        );
    }
}
