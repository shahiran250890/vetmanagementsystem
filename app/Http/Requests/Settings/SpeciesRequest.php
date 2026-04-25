<?php

namespace App\Http\Requests\Settings;

use App\Models\Settings\Species;
use App\Support\SettingsPermissionName;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class SpeciesRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $ability = $this->route('species') instanceof Species
            ? 'update'
            : 'create';

        return SettingsPermissionName::userCanAny($this->user(), $ability, 'species');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        /** @var Species|null $species */
        $species = $this->route('species');

        return [
            'name' => ['required', 'string', 'max:255', Rule::unique('species', 'name')->ignore($species?->id)],
            'code' => ['required', 'string', 'max:120', Rule::unique('species', 'code')->ignore($species?->id)],
            'is_enabled' => ['required', 'boolean'],
        ];
    }
}
