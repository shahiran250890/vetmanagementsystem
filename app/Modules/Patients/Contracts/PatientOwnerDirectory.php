<?php

namespace App\Modules\Patients\Contracts;

interface PatientOwnerDirectory
{
    /**
     * @return list<array{id: int, name: string}>
     */
    public function listOwnerOptions(): array;
}
