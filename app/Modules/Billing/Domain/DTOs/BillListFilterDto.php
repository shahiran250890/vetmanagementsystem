<?php

namespace App\Modules\Billing\Domain\DTOs;

use Illuminate\Http\Request;

final readonly class BillListFilterDto
{
    public function __construct(
        public ?int $patientId = null,
        public ?string $status = null,
        public int $perPage = 15,
    ) {}

    public static function fromRequest(Request $request): self
    {
        return new self(
            patientId: $request->integer('patient_id') ?: null,
            status: $request->string('status')->toString() ?: null,
            perPage: min(100, max(1, (int) $request->input('per_page', 15))),
        );
    }
}
