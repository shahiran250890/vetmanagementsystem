<?php

namespace App\Models\Patients;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Multitenancy\Models\Concerns\UsesTenantConnection;

class PatientHumanProfile extends Model
{
    use UsesTenantConnection;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'patient_id',
        'identification_number',
        'blood_type',
        'blood_type_id',
        'primary_phone',
        'address',
        'height_cm',
        'weight_kg',
        'blood_pressure',
        'vital_medical_information',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'height_cm' => 'decimal:2',
            'weight_kg' => 'decimal:2',
        ];
    }

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }

    public function bloodType(): BelongsTo
    {
        return $this->belongsTo(BloodType::class);
    }
}
