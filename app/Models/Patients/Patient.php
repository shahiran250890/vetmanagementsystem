<?php

namespace App\Models\Patients;

use App\Models\User;
use Database\Factories\Patients\PatientFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Multitenancy\Models\Concerns\UsesTenantConnection;

class Patient extends Model
{
    /** @use HasFactory<PatientFactory> */
    use HasFactory, SoftDeletes, UsesTenantConnection;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'name',
        'species',
        'breed',
        'sex',
        'date_of_birth',
        'color',
        'microchip_number',
        'emergency_contact_name',
        'emergency_contact_phone',
        'allergies',
        'current_medications',
        'latest_weight_kg',
        'vaccination_status',
        'status',
        'notes',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'date_of_birth' => 'date',
            'latest_weight_kg' => 'decimal:2',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function historyEntries(): HasMany
    {
        return $this->hasMany(PatientHistoryEntry::class);
    }
}
