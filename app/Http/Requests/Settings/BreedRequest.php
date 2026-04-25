<?php

namespace App\Http\Requests\Settings;

use App\Models\Settings\Breed;
use App\Support\SettingsPermissionName;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class BreedRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $ability = $this->route('breed') instanceof Breed
            ? 'update'
            : 'create';

        return SettingsPermissionName::userCanAny($this->user(), $ability, 'breed');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        /** @var Breed|null $breed */
        $breed = $this->route('breed');

        return [
            'species_id' => ['required', 'integer', 'exists:species,id'],
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('breeds', 'name')
                    ->where(fn ($query) => $query->where('species_id', (int) $this->input('species_id')))
                    ->ignore($breed?->id),
            ],
            'code' => ['required', 'string', 'max:120', Rule::unique('breeds', 'code')->ignore($breed?->id)],
            'is_enabled' => ['required', 'boolean'],
        ];
    }
}
