<?php

namespace App\Http\Requests\Settings;

use App\Support\SettingsPermissionName;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StaffBulkRolesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return SettingsPermissionName::userCanAny($this->user(), 'update', 'user');
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'staff_ids' => ['required', 'array', 'min:1'],
            'staff_ids.*' => ['integer', 'exists:staff,id'],
            'role_ids' => ['nullable', 'array'],
            'role_ids.*' => ['integer', 'exists:roles,id'],
            'replace_existing' => ['boolean'],
        ];
    }
}
