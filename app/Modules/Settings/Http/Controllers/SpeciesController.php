<?php

namespace App\Modules\Settings\Http\Controllers;

use App\Concerns\HasResourcePermission;
use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\SpeciesRequest;
use App\Models\Settings\Breed;
use App\Models\Settings\OrganizationProfile;
use App\Models\Settings\Species;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class SpeciesController extends Controller
{
    use HasResourcePermission;

    protected function resourcePermissionName(): string
    {
        return 'species';
    }

    public function index(Request $request): Response
    {
        abort_unless($this->speciesManagementEnabled(), 403);
        $this->authorizeResourcePermission('view');
        $search = $request->string('search')->trim()->toString();

        return Inertia::render('settings/system/species/index', [
            'species' => Species::query()
                ->withCount('breeds')
                ->when($search !== '', fn ($query) => $query->where('name', 'like', "%{$search}%"))
                ->orderBy('name')
                ->paginate(10)
                ->withQueryString(),
            'filters' => [
                'search' => $search,
            ],
            ...$this->resourcePermissionProps(),
        ]);
    }

    public function create(): Response
    {
        abort_unless($this->speciesManagementEnabled(), 403);
        $this->authorizeResourcePermission('create');

        return Inertia::render('settings/system/species/index', [
            'species' => Species::query()->withCount('breeds')->orderBy('name')->paginate(10),
            'formMode' => 'create',
            ...$this->resourcePermissionProps(),
        ]);
    }

    public function show(Species $species): Response
    {
        abort_unless($this->speciesManagementEnabled(), 403);
        $this->authorizeResourcePermission('view');

        return Inertia::render('settings/system/species/show', [
            'species' => $species->load(['breeds' => fn ($query) => $query->orderBy('name')]),
            ...$this->resourcePermissionProps(),
        ]);
    }

    public function store(SpeciesRequest $request): RedirectResponse
    {
        abort_unless($this->speciesManagementEnabled(), 403);
        $validated = $request->validated();

        DB::transaction(function () use ($validated): void {
            $species = Species::query()->create([
                'name' => $validated['name'],
                'code' => $validated['code'],
                'is_enabled' => $validated['is_enabled'],
            ]);

            $breeds = collect($validated['breeds'] ?? [])
                ->map(fn (array $breed): array => [
                    'species_id' => $species->id,
                    'name' => $breed['name'],
                    'code' => $breed['code'],
                    'is_enabled' => $breed['is_enabled'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ])
                ->all();

            if ($breeds !== []) {
                Breed::query()->insert($breeds);
            }
        });

        return to_route('settings.system.species.index');
    }

    public function edit(Species $species): Response
    {
        abort_unless($this->speciesManagementEnabled(), 403);
        $this->authorizeResourcePermission('update');

        return Inertia::render('settings/system/species/index', [
            'species' => Species::query()->withCount('breeds')->orderBy('name')->paginate(10),
            'editingSpecies' => $species->load('breeds'),
            'formMode' => 'edit',
            ...$this->resourcePermissionProps(),
        ]);
    }

    public function update(SpeciesRequest $request, Species $species): RedirectResponse
    {
        abort_unless($this->speciesManagementEnabled(), 403);
        $validated = $request->validated();

        DB::transaction(function () use ($species, $validated): void {
            $species->update([
                'name' => $validated['name'],
                'code' => $validated['code'],
                'is_enabled' => $validated['is_enabled'],
            ]);

            $submittedBreeds = collect($validated['breeds'] ?? []);
            $submittedIds = $submittedBreeds
                ->pluck('id')
                ->filter()
                ->map(fn (mixed $id): int => (int) $id)
                ->values();

            if ($submittedIds->isEmpty()) {
                $species->breeds()->delete();
            } else {
                $species->breeds()->whereNotIn('id', $submittedIds)->delete();
            }

            foreach ($submittedBreeds as $breedData) {
                $breedId = data_get($breedData, 'id');

                $species->breeds()->updateOrCreate(
                    ['id' => $breedId],
                    [
                        'name' => $breedData['name'],
                        'code' => $breedData['code'],
                        'is_enabled' => $breedData['is_enabled'],
                    ],
                );
            }
        });

        return to_route('settings.system.species.index');
    }

    public function destroy(Species $species): RedirectResponse
    {
        abort_unless($this->speciesManagementEnabled(), 403);
        $this->authorizeResourcePermission('delete');
        $species->delete();

        return to_route('settings.system.species.index');
    }

    protected function speciesManagementEnabled(): bool
    {
        try {
            return OrganizationProfile::query()->value('clinic_type') !== 'human';
        } catch (\Throwable) {
            return true;
        }
    }
}
