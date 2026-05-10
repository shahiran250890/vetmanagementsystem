<?php

namespace App\Models;

use Database\Factories\StaffFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Multitenancy\Models\Concerns\UsesTenantConnection;

class Staff extends Model
{
    /** @use HasFactory<StaffFactory> */
    use HasFactory, SoftDeletes, UsesTenantConnection;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'staff_number',
        'full_name',
        'preferred_name',
        'nric_passport',
        'gender',
        'date_of_birth',
        'nationality',
        'marital_status',
        'photo_path',
        'mobile_number',
        'alternate_phone',
        'email',
        'address_line_1',
        'address_line_2',
        'city',
        'state',
        'postcode',
        'country',
        'emergency_contact_name',
        'emergency_contact_phone',
        'employee_number',
        'hire_date',
        'confirmation_date',
        'position',
        'department',
        'reporting_manager_id',
        'employment_type',
        'salary_type',
        'assigned_clinics',
        'working_hours',
        'employment_status',
        'is_active',
        'medical_registration_number',
        'apc_number',
        'apc_expiry_date',
        'specialization',
        'qualifications',
        'years_experience',
        'documents',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'date_of_birth' => 'date',
            'hire_date' => 'date',
            'confirmation_date' => 'date',
            'apc_expiry_date' => 'date',
            'assigned_clinics' => 'array',
            'documents' => 'array',
            'is_active' => 'boolean',
        ];
    }

    public function reportingManager(): BelongsTo
    {
        return $this->belongsTo(self::class, 'reporting_manager_id');
    }

    public function user(): HasOne
    {
        return $this->hasOne(User::class);
    }

    /**
     * Scope staff rows linked to manageable users (not super-admin slot id 1 or self).
     *
     * @param  Builder<Staff>  $query
     * @return Builder<Staff>
     */
    public function scopeManageableFor(Builder $query, ?int $actorUserId): Builder
    {
        return $query->where(function (Builder $group) use ($actorUserId): void {
            $group->whereDoesntHave('user')
                ->orWhereHas('user', function (Builder $userQuery) use ($actorUserId): void {
                    $userQuery->where('id', '!=', 1)
                        ->when($actorUserId !== null, fn (Builder $uq) => $uq->where('id', '!=', $actorUserId));
                });
        });
    }
}
