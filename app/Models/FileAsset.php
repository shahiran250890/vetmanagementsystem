<?php

namespace App\Models;

use App\Modules\Settings\Application\Services\FileAssetStorageService;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Multitenancy\Models\Concerns\UsesTenantConnection;

class FileAsset extends Model
{
    use HasUuids;
    use SoftDeletes;
    use UsesTenantConnection;

    public $incrementing = false;

    protected static function booted(): void
    {
        static::deleting(function (FileAsset $fileAsset): void {
            app(FileAssetStorageService::class)->deleteStoredFile($fileAsset);
        });
    }

    protected $keyType = 'string';

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'module_name',
        'record_id',
        'category',
        'disk',
        'path',
        'original_name',
        'stored_name',
        'mime_type',
        'size_bytes',
        'uploaded_by_user_id',
        'meta',
    ];

    protected function casts(): array
    {
        return [
            'size_bytes' => 'integer',
            'meta' => 'array',
        ];
    }

    public function uploadedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by_user_id');
    }
}
