<?php

namespace App\Models\Patients;

use App\Models\User;
use Database\Factories\Patients\PatientHistoryEntryFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Multitenancy\Models\Concerns\UsesTenantConnection;

class PatientHistoryEntry extends Model
{
    /** @use HasFactory<PatientHistoryEntryFactory> */
    use HasFactory, UsesTenantConnection;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'patient_id',
        'created_by',
        'visit_case_number',
        'entry_date',
        'visit_at',
        'clinic_location',
        'veterinarian_user_id',
        'assistant_user_id',
        'visit_type',
        'appointment_id',
        'visit_status',
        'entry_type',
        'title',
        'details',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'entry_date' => 'date',
            'visit_at' => 'datetime',
        ];
    }

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function veterinarian(): BelongsTo
    {
        return $this->belongsTo(User::class, 'veterinarian_user_id');
    }

    public function assistant(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assistant_user_id');
    }
}
