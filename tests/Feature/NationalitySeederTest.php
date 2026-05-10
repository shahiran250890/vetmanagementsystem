<?php

use App\Http\Middleware\EnsureTenantIsEnabled;
use App\Models\Nationality;
use Database\Seeders\NationalitySeeder;

beforeEach(function (): void {
    config(['multitenancy.tenant_database_connection_name' => config('database.default')]);
    $this->withoutMiddleware(EnsureTenantIsEnabled::class);
    $this->artisan('migrate', [
        '--database' => config('database.default'),
        '--path' => 'database/migrations/tenant',
        '--realpath' => false,
        '--force' => true,
    ])->run();
});

test('nationality seeder inserts reference rows', function (): void {
    $this->seed(NationalitySeeder::class);

    expect(Nationality::query()->count())->toBeGreaterThan(100)
        ->and(Nationality::query()->where('iso3166_alpha2', 'MY')->value('name'))->toBe('Malaysia')
        ->and(Nationality::query()->where('iso3166_alpha2', 'SG')->value('sort_order'))
        ->toBeLessThan(Nationality::query()->where('iso3166_alpha2', 'DE')->value('sort_order'));
});
