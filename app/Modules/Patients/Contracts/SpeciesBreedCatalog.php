<?php

namespace App\Modules\Patients\Contracts;

interface SpeciesBreedCatalog
{
    /**
     * @return list<array{id: int, name: string, breeds: list<array{id: int, name: string}>}>
     */
    public function listEnabledSpeciesWithBreeds(): array;
}
