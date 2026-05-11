<?php

use App\Http\Middleware\EnsureTenantIsEnabled;
use App\Models\FileAsset;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

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

test('uploads file and stores metadata with tenant structured path', function (): void {
    Storage::fake('local');
    config(['filesystems.uploads_disk' => 'local']);

    app()->instance('currentTenant', new class
    {
        public string $name = 'Happy Paws Clinic';

        public function getKey(): string
        {
            return 'tenant-123';
        }
    });

    $actor = User::factory()->create();
    $file = UploadedFile::fake()->create('apc-certificate.pdf', 64, 'application/pdf');

    $response = $this->actingAs($actor)
        ->post(route('settings.system.files.store'), [
            'file' => $file,
            'module_name' => 'staff-management',
            'record_id' => '15',
            'category' => 'documents',
        ]);

    $response->assertCreated()
        ->assertJsonStructure([
            'id',
            'name',
            'size',
            'mime_type',
            'view_url',
            'download_url',
        ]);

    $asset = FileAsset::query()->first();
    expect($asset)->not->toBeNull()
        ->and($asset->path)->toStartWith('happy-paws-clinic/staff-management/15/documents/')
        ->and($asset->uploaded_by_user_id)->toBe($actor->id);

    Storage::disk('local')->assertExists($asset->path);
});

test('can view and delete uploaded file', function (): void {
    Storage::fake('local');
    config(['filesystems.uploads_disk' => 'local']);

    $actor = User::factory()->create();
    $file = UploadedFile::fake()->create('staff-contract.pdf', 64, 'application/pdf');

    $uploadResponse = $this->actingAs($actor)
        ->post(route('settings.system.files.store'), [
            'file' => $file,
            'module_name' => 'staff-management',
            'record_id' => '21',
            'category' => 'contracts',
        ]);

    $uploadResponse->assertCreated();
    $assetId = (string) $uploadResponse->json('id');

    $this->actingAs($actor)
        ->get(route('settings.system.files.show', $assetId))
        ->assertOk();

    $asset = FileAsset::query()->findOrFail($assetId);
    $storedPath = $asset->path;

    $this->actingAs($actor)
        ->delete(route('settings.system.files.destroy', $assetId))
        ->assertOk()
        ->assertJson(['deleted' => true]);

    expect(FileAsset::withTrashed()->findOrFail($assetId)->trashed())->toBeTrue();
    Storage::disk('local')->assertMissing($storedPath);
});
