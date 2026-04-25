<?php

namespace App\Models\Patients;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Multitenancy\Models\Concerns\UsesTenantConnection;

class PatientAnimalProfile extends Model
{
    use UsesTenantConnection;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'patient_id',
        'owner_user_id',
        'species',
        'breed',
        'color',
        'microchip_number',
        'latest_weight_kg',
        'vaccination_status',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'latest_weight_kg' => 'decimal:2',
        ];
    }

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_user_id');
    }
}
