<?php

namespace App\Models\Settings;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Multitenancy\Models\Concerns\UsesTenantConnection;

class OrganizationProfile extends Model
{
    use HasFactory, UsesTenantConnection;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'clinic_type',
        'organization_name',
        'organization_phone',
        'organization_email',
        'organization_fax',
        'organization_license',
        'organization_address',
    ];
}
