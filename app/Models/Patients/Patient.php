<?php

namespace App\Models\Patients;

use App\Models\Appointments\Appointment;
use App\Models\Billing\Bill;
use App\Models\Medical\MedicalCertificate;
use App\Models\Medical\MedicalRecord;
use App\Models\User;
use Database\Factories\Patients\PatientFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
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
        'patient_type',
        'user_id',
        'name',
        'breed',
        'sex',
        'date_of_birth',
        'color',
        'microchip_number',
        'emergency_contact_name',
        'emergency_contact_phone',
        'allergies',
        'current_medications',
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
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function humanProfile(): HasOne
    {
        return $this->hasOne(PatientHumanProfile::class);
    }

    public function animalProfile(): HasOne
    {
        return $this->hasOne(PatientAnimalProfile::class);
    }

    public function historyEntries(): HasMany
    {
        return $this->hasMany(PatientHistoryEntry::class);
    }

    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class);
    }

    public function medicalRecords(): HasMany
    {
        return $this->hasMany(MedicalRecord::class);
    }

    public function medicalCertificates(): HasMany
    {
        return $this->hasMany(MedicalCertificate::class);
    }

    public function bills(): HasMany
    {
        return $this->hasMany(Bill::class);
    }

    public function vitals(): HasMany
    {
        return $this->hasMany(PatientVital::class);
    }
}
