<?php

namespace App\Models\Medical;

use App\Enums\Medical\MedicalCertificateStatus;
use App\Models\Patients\Patient;
use App\Models\User;
use Database\Factories\Medical\MedicalCertificateFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Multitenancy\Models\Concerns\UsesTenantConnection;

class MedicalCertificate extends Model
{
    /** @use HasFactory<MedicalCertificateFactory> */
    use HasFactory, UsesTenantConnection;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'patient_id',
        'medical_record_id',
        'doctor_id',
        'certificate_number',
        'employer_name',
        'unfit_from',
        'unfit_to',
        'remarks',
        'status',
        'issued_at',
        'voided_at',
        'void_reason',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => MedicalCertificateStatus::class,
            'unfit_from' => 'date',
            'unfit_to' => 'date',
            'issued_at' => 'datetime',
            'voided_at' => 'datetime',
        ];
    }

    public function patient(): BelongsTo
    {
        return $this->belongsTo(Patient::class);
    }

    public function medicalRecord(): BelongsTo
    {
        return $this->belongsTo(MedicalRecord::class);
    }

    public function doctor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'doctor_id');
    }

    public function isVoided(): bool
    {
        return $this->status === MedicalCertificateStatus::Voided;
    }
}
