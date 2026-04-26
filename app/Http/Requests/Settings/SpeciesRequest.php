<?php

namespace App\Http\Requests\Settings;

use App\Models\Settings\Breed;
use App\Models\Settings\Species;
use App\Support\SettingsPermissionName;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

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
            'name' => ['required', 'string', 'max:255', Rule::unique(Species::class, 'name')->ignore($species?->id)],
            'code' => ['required', 'string', 'max:120', Rule::unique(Species::class, 'code')->ignore($species?->id)],
            'is_enabled' => ['required', 'boolean'],
            'breeds' => ['nullable', 'array'],
            'breeds.*.id' => [
                'nullable',
                'integer',
                Rule::exists(Breed::class, 'id')->where(
                    fn ($query) => $species === null ? $query : $query->where('species_id', $species->id),
                ),
            ],
            'breeds.*.name' => ['required', 'string', 'max:255'],
            'breeds.*.code' => ['required', 'string', 'max:120'],
            'breeds.*.is_enabled' => ['required', 'boolean'],
        ];
    }

    /**
     * @return array<int, \Closure(Validator): void>
     */
    public function after(): array
    {
        return [function (Validator $validator): void {
            $breeds = $this->input('breeds', []);

            if (! is_array($breeds)) {
                return;
            }

            $nameIndexesByNormalized = [];
            $codeIndexesByNormalized = [];

            foreach ($breeds as $index => $breed) {
                $name = strtolower(trim((string) data_get($breed, 'name')));
                $code = strtolower(trim((string) data_get($breed, 'code')));

                if ($name !== '') {
                    $nameIndexesByNormalized[$name][] = $index;
                }

                if ($code !== '') {
                    $codeIndexesByNormalized[$code][] = $index;
                }
            }

            foreach ($nameIndexesByNormalized as $indexes) {
                if (count($indexes) < 2) {
                    continue;
                }

                foreach ($indexes as $index) {
                    $validator->errors()->add("breeds.{$index}.name", 'Breed name must be unique within this species.');
                }
            }

            foreach ($codeIndexesByNormalized as $indexes) {
                if (count($indexes) < 2) {
                    continue;
                }

                foreach ($indexes as $index) {
                    $validator->errors()->add("breeds.{$index}.code", 'Breed code must be unique.');
                }
            }
        }];
    }
}
