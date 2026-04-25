<?php

namespace App\Services\Patients;

use App\Models\Patients\Patient;
use App\Models\Patients\PatientHistoryEntry;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

class PatientHistoryService
{
    /**
     * @param  array<string, mixed>  $validated
     */
    public function create(Patient $patient, array $validated, int $createdBy): PatientHistoryEntry
    {
        return $patient->historyEntries()->create([
            ...Arr::except($validated, ['visit_case_number', 'veterinarian_user_id', 'assistant_user_id']),
            'visit_case_number' => $this->generateVisitCaseNumber($patient),
            'veterinarian_user_id' => Arr::get($validated, 'veterinarian_user_id') ?: null,
            'assistant_user_id' => Arr::get($validated, 'assistant_user_id') ?: null,
            'created_by' => $createdBy,
        ]);
    }

    protected function generateVisitCaseNumber(Patient $patient): string
    {
        return sprintf(
            'CASE-%d-%s-%s',
            $patient->id,
            now()->format('YmdHis'),
            Str::upper(Str::random(4)),
        );
    }
}
