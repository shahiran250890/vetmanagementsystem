<?php

namespace App\Modules\Patients\Infrastructure;

use App\Models\Settings\Species;
use App\Modules\Patients\Contracts\SpeciesBreedCatalog;
use Illuminate\Support\Facades\Schema;

final class EloquentSpeciesBreedCatalog implements SpeciesBreedCatalog
{
    /**
     * @return list<array{id: int, name: string, breeds: list<array{id: int, name: string}>}>
     */
    public function listEnabledSpeciesWithBreeds(): array
    {
        if (! Schema::connection('tenant')->hasTable('species') || ! Schema::connection('tenant')->hasTable('breeds')) {
            return [];
        }

        /** @var list<array{id: int, name: string, breeds: list<array{id: int, name: string}>}> $species */
        $species = Species::query()
            ->select(['id', 'name'])
            ->where('is_enabled', true)
            ->with(['breeds' => fn ($query) => $query
                ->select(['id', 'species_id', 'name'])
                ->where('is_enabled', true)
                ->orderBy('name')])
            ->orderBy('name')
            ->get()
            ->map(fn (Species $item): array => [
                'id' => $item->id,
                'name' => $item->name,
                'breeds' => $item->breeds
                    ->map(fn ($breed): array => [
                        'id' => $breed->id,
                        'name' => $breed->name,
                    ])
                    ->all(),
            ])
            ->all();

        return $species;
    }
}
