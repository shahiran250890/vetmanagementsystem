<?php

namespace App\Modules\Settings\Application\Services;

use App\Models\FileAsset;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileAssetStorageService
{
    /**
     * @return array{disk: string, path: string, stored_name: string, original_name: string, mime_type: string|null, size_bytes: int}
     */
    public function storeUploadedFile(
        UploadedFile $uploadedFile,
        string $moduleName,
        ?string $recordId = null,
        ?string $category = null
    ): array {
        $disk = (string) config('filesystems.uploads_disk', 'local');
        $tenantSegment = $this->tenantSegment();
        $moduleSegment = $this->safeSegment($moduleName, 'module');
        $recordSegment = $this->safeSegment($recordId, 'unassigned');
        $categorySegment = $this->safeSegment($category, 'general');

        $cleanOriginal = trim((string) $uploadedFile->getClientOriginalName());
        $safeOriginal = $cleanOriginal !== '' ? preg_replace('/[^A-Za-z0-9._-]/', '_', $cleanOriginal) : 'file.bin';
        $storedName = Str::uuid()->toString().'_'.$safeOriginal;

        $directory = "{$tenantSegment}/{$moduleSegment}/{$recordSegment}/{$categorySegment}";
        $path = Storage::disk($disk)->putFileAs($directory, $uploadedFile, $storedName);

        return [
            'disk' => $disk,
            'path' => (string) $path,
            'stored_name' => $storedName,
            'original_name' => $cleanOriginal !== '' ? $cleanOriginal : $storedName,
            'mime_type' => $uploadedFile->getClientMimeType(),
            'size_bytes' => (int) $uploadedFile->getSize(),
        ];
    }

    public function deleteStoredFile(FileAsset $fileAsset): void
    {
        Storage::disk($fileAsset->disk)->delete($fileAsset->path);
    }

    private function tenantSegment(): string
    {
        $containerKey = (string) config('multitenancy.current_tenant_container_key', 'currentTenant');
        $tenant = app()->bound($containerKey) ? app($containerKey) : null;

        if (is_object($tenant)) {
            $name = trim((string) data_get($tenant, 'name', method_exists($tenant, 'getKey') ? (string) $tenant->getKey() : ''));
            $id = method_exists($tenant, 'getKey') ? (string) $tenant->getKey() : 'tenant';

            return $this->safeSegment($name, $id);
        }

        return 'tenant-unknown';
    }

    private function safeSegment(?string $value, string $fallback): string
    {
        $candidate = trim((string) $value);
        $slug = Str::slug($candidate, '-');

        if ($slug === '') {
            return Str::slug($fallback, '-') ?: 'segment';
        }

        return $slug;
    }
}
