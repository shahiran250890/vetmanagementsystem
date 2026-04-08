<?php

namespace App\Http\Controllers\Settings;

use App\Concerns\HasResourcePermission;
use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\BreedRequest;
use App\Models\Settings\Breed;
use App\Models\Settings\Species;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class BreedController extends Controller
{
    use HasResourcePermission;

    protected function resourcePermissionName(): string
    {
        return 'breed';
    }

    public function index(): Response
    {
        $this->authorizeResourcePermission('view');

        return Inertia::render('settings/system/breeds/index', [
            'breeds' => Breed::query()->with('species')->latest()->get(),
            ...$this->resourcePermissionProps(),
        ]);
    }

    public function create(): Response
    {
        $this->authorizeResourcePermission('create');

        return Inertia::render('settings/system/breeds/index', [
            'breeds' => Breed::query()->with('species')->latest()->get(),
            'speciesOptions' => Species::query()->select(['id', 'name'])->orderBy('name')->get(),
            'formMode' => 'create',
            ...$this->resourcePermissionProps(),
        ]);
    }

    public function store(BreedRequest $request): RedirectResponse
    {
        Breed::query()->create($request->validated());

        return to_route('settings.system.breeds.index');
    }

    public function edit(Breed $breed): Response
    {
        $this->authorizeResourcePermission('update');

        return Inertia::render('settings/system/breeds/index', [
            'breeds' => Breed::query()->with('species')->latest()->get(),
            'editingBreed' => $breed,
            'speciesOptions' => Species::query()->select(['id', 'name'])->orderBy('name')->get(),
            'formMode' => 'edit',
            ...$this->resourcePermissionProps(),
        ]);
    }

    public function update(BreedRequest $request, Breed $breed): RedirectResponse
    {
        $breed->update($request->validated());

        return to_route('settings.system.breeds.index');
    }

    public function destroy(Breed $breed): RedirectResponse
    {
        $this->authorizeResourcePermission('delete');
        $breed->delete();

        return to_route('settings.system.breeds.index');
    }
}
