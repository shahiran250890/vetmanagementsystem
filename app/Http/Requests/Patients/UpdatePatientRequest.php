<?php

namespace App\Http\Requests\Patients;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePatientRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $patient = $this->route('patient');
        $animalProfileId = $patient?->animalProfile?->id;

        return array_merge([
            'patient_type' => ['required', Rule::in(['human', 'animal'])],
            'name' => ['required', 'string', 'max:255'],
            'sex' => ['nullable', Rule::in(['1', '2'])],
            'date_of_birth' => ['nullable', 'date', 'before_or_equal:today'],
            'emergency_contact_name' => ['nullable', 'string', 'max:255'],
            'emergency_contact_phone' => ['nullable', 'string', 'max:50'],
            'allergies' => ['nullable', 'string'],
            'current_medications' => ['nullable', 'string'],
            'status' => ['required', Rule::in(['active', 'deceased', 'transferred'])],
            'notes' => ['nullable', 'string'],
        ], $this->animalRules($animalProfileId), $this->humanRules());
    }

    /**
     * @return array<string, array<int, ValidationRule|string>>
     */
    protected function animalRules(?int $animalProfileId): array
    {
        $isAnimal = $this->input('patient_type') === 'animal';

        return [
            'animal_profile.owner_user_id' => [$isAnimal ? 'nullable' : 'prohibited', 'integer', 'exists:users,id'],
            'animal_profile.species' => [$isAnimal ? 'required' : 'prohibited', 'string', 'max:255'],
            'animal_profile.breed' => [$isAnimal ? 'nullable' : 'prohibited', 'string', 'max:255'],
            'animal_profile.color' => [$isAnimal ? 'nullable' : 'prohibited', 'string', 'max:255'],
            'animal_profile.microchip_number' => [
                $isAnimal ? 'nullable' : 'prohibited',
                'string',
                'max:255',
                Rule::unique('patient_animal_profiles', 'microchip_number')->ignore($animalProfileId),
            ],
            'animal_profile.latest_weight_kg' => [$isAnimal ? 'nullable' : 'prohibited', 'numeric', 'min:0', 'max:999.99'],
            'animal_profile.vaccination_status' => [$isAnimal ? 'nullable' : 'prohibited', 'string', 'max:255'],
        ];
    }

    /**
     * @return array<string, array<int, ValidationRule|string>>
     */
    protected function humanRules(): array
    {
        $isHuman = $this->input('patient_type') === 'human';

        return [
            'human_profile.identification_number' => [$isHuman ? 'nullable' : 'prohibited', 'string', 'max:255'],
            'human_profile.blood_type_id' => [$isHuman ? 'nullable' : 'prohibited', 'integer', 'exists:blood_types,id'],
            'human_profile.primary_phone' => [$isHuman ? 'nullable' : 'prohibited', 'string', 'max:50'],
            'human_profile.address' => [$isHuman ? 'nullable' : 'prohibited', 'string'],
            'human_profile.height_cm' => [$isHuman ? 'nullable' : 'prohibited', 'numeric', 'min:30', 'max:260'],
            'human_profile.weight_kg' => [$isHuman ? 'nullable' : 'prohibited', 'numeric', 'min:1', 'max:500'],
            'human_profile.blood_pressure' => [$isHuman ? 'nullable' : 'prohibited', 'string', 'max:20'],
            'human_profile.vital_medical_information' => [$isHuman ? 'nullable' : 'prohibited', 'string'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'patient_type.required' => 'Please choose whether this is a human or animal patient.',
            'name.required' => 'Please provide the patient name.',
            'animal_profile.species.required' => 'Please provide the species for animal patients.',
            'status.required' => 'Please choose a patient status.',
            'status.in' => 'Patient status must be active, deceased, or transferred.',
        ];
    }
}
