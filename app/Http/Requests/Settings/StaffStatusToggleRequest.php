<?php

namespace App\Http\Requests\Settings;

use App\Models\Staff;
use App\Support\SettingsPermissionName;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StaffStatusToggleRequest extends FormRequest
{
    public function authorize(): bool
    {
        $managedStaff = $this->route('managed_staff');

        return $managedStaff instanceof Staff
            && SettingsPermissionName::userCanAny($this->user(), 'update', 'user');
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'is_enabled' => ['required', 'boolean'],
        ];
    }
}
