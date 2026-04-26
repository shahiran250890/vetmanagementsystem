<?php

namespace App\Http\Requests\Settings;

use App\Support\SettingsPermissionName;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class OrganizationProfileRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return SettingsPermissionName::userCanAny($this->user(), 'update', 'system setting');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'clinic_type' => ['required', Rule::in(['vet', 'human'])],
            'organization_name' => ['required', 'string', 'max:255'],
            'organization_phone' => ['required', 'string', 'max:50'],
            'organization_email' => ['required', 'email', 'max:255'],
            'organization_fax' => ['required', 'string', 'max:50'],
            'organization_license' => ['required', 'string', 'max:255'],
        ];
    }
}
