<?php

namespace App\Modules\Patients\Infrastructure;

use App\Models\User;
use App\Modules\Patients\Contracts\PatientOwnerDirectory;

final class EloquentPatientOwnerDirectory implements PatientOwnerDirectory
{
    /**
     * @return list<array{id: int, name: string}>
     */
    public function listOwnerOptions(): array
    {
        /** @var list<array{id: int, name: string}> $owners */
        $owners = User::query()
            ->select(['id', 'name'])
            ->orderBy('name')
            ->get()
            ->map(fn (User $owner): array => [
                'id' => $owner->id,
                'name' => $owner->name,
            ])
            ->all();

        return $owners;
    }
}
