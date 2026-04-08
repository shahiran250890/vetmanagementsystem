<?php

namespace App\Http\Controllers\Settings;

use App\Concerns\HasResourcePermission;
use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\SpeciesRequest;
use App\Models\Settings\Species;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SpeciesController extends Controller
{
    use HasResourcePermission;

    protected function resourcePermissionName(): string
    {
        return 'species';
    }

    public function index(): Response
    {
        $this->authorizeResourcePermission('view');

        return Inertia::render('settings/system/species/index', [
            'species' => Species::query()->withCount('breeds')->latest()->get(),
            ...$this->resourcePermissionProps(),
        ]);
    }

    public function create(): Response
    {
        $this->authorizeResourcePermission('create');

        return Inertia::render('settings/system/species/index', [
            'species' => Species::query()->withCount('breeds')->latest()->get(),
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
            'species' => Species::query()->withCount('breeds')->latest()->get(),
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
