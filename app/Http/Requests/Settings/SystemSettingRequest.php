<?php

namespace App\Http\Requests\Settings;

use App\Models\Settings\SystemSetting;
use App\Support\SettingsPermissionName;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SystemSettingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $ability = $this->route('system_setting') instanceof SystemSetting
            ? 'update'
            : 'create';

        return SettingsPermissionName::userCanAny($this->user(), $ability, 'system setting');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        /** @var SystemSetting|null $setting */
        $setting = $this->route('system_setting');

        return [
            'key' => ['required', 'string', 'max:120', Rule::unique('system_settings', 'key')->ignore($setting?->id)],
            'label' => ['required', 'string', 'max:255'],
            'value' => ['nullable', 'string'],
            'is_enabled' => ['required', 'boolean'],
        ];
    }
}
