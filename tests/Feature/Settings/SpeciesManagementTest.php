<?php

use App\Http\Middleware\EnsureTenantIsEnabled;
use App\Models\Permission;
use App\Models\Settings\Breed;
use App\Models\Settings\Species;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    config()->set('multitenancy.tenant_database_connection_name', config('database.default'));
    $this->withoutMiddleware(EnsureTenantIsEnabled::class);
    $this->artisan('migrate', [
        '--database' => config('database.default'),
        '--path' => 'database/migrations/tenant',
        '--realpath' => false,
        '--force' => true,
    ])->run();
});

test('species can be created with multiple breeds from species form', function () {
    $actor = User::factory()->create();
    $actor->givePermissionTo(Permission::query()->create([
        'name' => 'create species',
        'guard_name' => 'web',
    ]));

    $response = $this->actingAs($actor)->post(route('settings.system.species.store'), [
        'name' => 'Canine',
        'code' => 'CAN',
        'is_enabled' => true,
        'breeds' => [
            [
                'name' => 'Labrador',
                'code' => 'LAB',
                'is_enabled' => true,
            ],
            [
                'name' => 'Beagle',
                'code' => 'BEA',
                'is_enabled' => false,
            ],
        ],
    ]);

    $response->assertRedirect(route('settings.system.species.index'));

    $species = Species::query()->where('code', 'CAN')->first();

    expect($species)->not->toBeNull();
    expect($species?->breeds()->count())->toBe(2);

    $this->assertDatabaseHas('breeds', [
        'species_id' => $species?->id,
        'name' => 'Labrador',
        'code' => 'LAB',
        'is_enabled' => true,
    ]);
    $this->assertDatabaseHas('breeds', [
        'species_id' => $species?->id,
        'name' => 'Beagle',
        'code' => 'BEA',
        'is_enabled' => false,
    ]);
});

test('species breeds can be updated in species form', function () {
    $actor = User::factory()->create();
    $actor->givePermissionTo(Permission::query()->create([
        'name' => 'update species',
        'guard_name' => 'web',
    ]));

    $species = Species::query()->create([
        'name' => 'Feline',
        'code' => 'FEL',
        'is_enabled' => true,
    ]);
    $existingBreed = Breed::query()->create([
        'species_id' => $species->id,
        'name' => 'Persian',
        'code' => 'PER',
        'is_enabled' => true,
    ]);
    Breed::query()->create([
        'species_id' => $species->id,
        'name' => 'Siamese',
        'code' => 'SIA',
        'is_enabled' => true,
    ]);

    $response = $this->actingAs($actor)->put(route('settings.system.species.update', $species), [
        'name' => 'Feline',
        'code' => 'FEL',
        'is_enabled' => true,
        'breeds' => [
            [
                'id' => $existingBreed->id,
                'name' => 'Persian Updated',
                'code' => 'PER',
                'is_enabled' => false,
            ],
            [
                'name' => 'Maine Coon',
                'code' => 'MCO',
                'is_enabled' => true,
            ],
        ],
    ]);

    $response->assertRedirect(route('settings.system.species.index'));

    $this->assertDatabaseHas('breeds', [
        'id' => $existingBreed->id,
        'species_id' => $species->id,
        'name' => 'Persian Updated',
        'code' => 'PER',
        'is_enabled' => false,
    ]);
    $this->assertDatabaseMissing('breeds', [
        'species_id' => $species->id,
        'name' => 'Siamese',
        'code' => 'SIA',
    ]);
    $this->assertDatabaseHas('breeds', [
        'species_id' => $species->id,
        'name' => 'Maine Coon',
        'code' => 'MCO',
        'is_enabled' => true,
    ]);
});

test('species detail page shows species and breeds', function () {
    $actor = User::factory()->create();
    $actor->givePermissionTo(Permission::query()->create([
        'name' => 'view species',
        'guard_name' => 'web',
    ]));

    $species = Species::query()->create([
        'name' => 'Canine',
        'code' => 'CAN',
        'is_enabled' => true,
    ]);

    Breed::query()->create([
        'species_id' => $species->id,
        'name' => 'Labrador',
        'code' => 'LAB',
        'is_enabled' => true,
    ]);

    $this->actingAs($actor)
        ->get(route('settings.system.species.show', $species))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('settings/system/species/show')
            ->where('species.id', $species->id)
            ->where('species.name', 'Canine')
            ->has('species.breeds', 1)
            ->where('species.breeds.0.name', 'Labrador'));
});
