<?php

namespace App\Http\Controllers\Settings;

use App\Concerns\HasResourcePermission;
use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\SpeciesRequest;
use App\Models\Settings\Species;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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
        $this->authorizeResourcePermission('create');

        return Inertia::render('settings/system/species/index', [
            'species' => Species::query()->withCount('breeds')->orderBy('name')->paginate(10),
            'formMode' => 'create',
            ...$this->resourcePermissionProps(),
        ]);
    }

    public function store(SpeciesRequest $request): RedirectResponse
    {
        Species::query()->create($request->validated());

        return to_route('settings.system.species.index');
    }

    public function edit(Species $species): Response
    {
        $this->authorizeResourcePermission('update');

        return Inertia::render('settings/system/species/index', [
            'species' => Species::query()->withCount('breeds')->orderBy('name')->paginate(10),
            'editingSpecies' => $species,
            'formMode' => 'edit',
            ...$this->resourcePermissionProps(),
        ]);
    }

    public function update(SpeciesRequest $request, Species $species): RedirectResponse
    {
        $species->update($request->validated());

        return to_route('settings.system.species.index');
    }

    public function destroy(Species $species): RedirectResponse
    {
        $this->authorizeResourcePermission('delete');
        $species->delete();

        return to_route('settings.system.species.index');
    }
}
