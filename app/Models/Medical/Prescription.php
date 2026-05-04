<?php

namespace App\Models\Medical;

use Database\Factories\Medical\PrescriptionFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Multitenancy\Models\Concerns\UsesTenantConnection;

class Prescription extends Model
{
    /** @use HasFactory<PrescriptionFactory> */
    use HasFactory, UsesTenantConnection;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'medical_record_id',
        'medicine_name',
        'dosage',
        'duration',
        'instructions',
    ];

    public function medicalRecord(): BelongsTo
    {
        return $this->belongsTo(MedicalRecord::class);
    }
}
