<?php

namespace App\Modules\Medical\Domain\DTOs;

use Illuminate\Http\Request;

final readonly class MedicalRecordListFilterDto
{
    public function __construct(
        public ?int $patientId = null,
        public ?int $doctorId = null,
        public int $perPage = 15,
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            patientId: $request->integer('patient_id') ?: null,
            doctorId: $request->integer('doctor_id') ?: null,
            perPage: min(100, max(1, (int) $request->input('per_page', 15))),
        );
    }
}
