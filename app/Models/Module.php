<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Multitenancy\Models\Concerns\UsesTenantConnection;

class Module extends Model
{
    use UsesTenantConnection;

    protected $table = 'modules';

    /**
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'key',
        'is_enabled',
    ];

    public function permissions(): HasMany
    {
        return $this->hasMany(Permission::class);
    }
}
