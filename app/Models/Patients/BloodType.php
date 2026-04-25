<?php

namespace App\Models\Patients;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Multitenancy\Models\Concerns\UsesTenantConnection;

class BloodType extends Model
{
    use UsesTenantConnection;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'name',
    ];

    public function humanProfiles(): HasMany
    {
        return $this->hasMany(PatientHumanProfile::class);
    }
}
