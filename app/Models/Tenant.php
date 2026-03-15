<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Spatie\Multitenancy\Models\Tenant as ModelsTenant;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tenant extends ModelsTenant
{
    /**
     * Only guard id and subscription_plan_id so create/update can set the rest.
     *
     * @var array<int, string>
     */
    protected $guarded = [
        'id',
        'subscription_plan_id',
    ];

    public $incrementing = false;

    protected $keyType = 'string';

    /**
     * @var array<int, string>
     */
    protected $appends = ['host'];

    protected function casts(): array
    {
        return [
            'database_username' => 'encrypted',
            'database_password' => 'encrypted',
            'is_enabled' => 'boolean',
        ];
    }

    /**
     * One tenant has many domains.
     */
    public function domains(): HasMany
    {
        return $this->hasMany(Domain::class);
    }

    /**
     * Database name for this tenant's connection. Required by Spatie multitenancy.
     * Uses the tenant table column `database_name`.
     */
    public function getDatabaseName(): string
    {
        $name = $this->database_name ?? $this->attributes['database_name'] ?? null;

        if ($name === null || $name === '') {
            throw new \InvalidArgumentException(
                "Tenant [{$this->getKey()}] is missing a database name. Set the `database_name` attribute for this tenant."
            );
        }

        $defaultDb = config('database.connections.mysql.database', config('database.connections.'.config('database.default').'.database'));
        if ($name === $defaultDb) {
            throw new \InvalidArgumentException(
                "Tenant [{$this->getKey()}] cannot use the main app database '{$name}'. Set `database_name` to a dedicated database (e.g. vetmanagementsystem_tenant_1), create that database in MySQL, then run migrations."
            );
        }

        return $name;
    }
}
