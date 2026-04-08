<?php

namespace App\Models\Settings;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Multitenancy\Models\Concerns\UsesTenantConnection;

class Species extends Model
{
    use HasFactory, UsesTenantConnection;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'code',
        'is_enabled',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_enabled' => 'boolean',
        ];
    }

    public function breeds(): HasMany
    {
        return $this->hasMany(Breed::class);
    }
}
