<?php

namespace App\Http\Requests\Settings;

use App\Models\Role;
use App\Models\Staff;
use App\Support\SettingsPermissionName;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StaffManagementRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        if ($this->has('assigned_clinics_text')) {
            $raw = $this->string('assigned_clinics_text')->toString();
            $parts = array_values(array_filter(array_map('trim', explode(',', $raw))));

            $this->merge([
                'assigned_clinics' => $parts === [] ? null : $parts,
            ]);
        }

        if ($this->filled('documents_metadata')) {
            $decoded = json_decode($this->string('documents_metadata')->toString(), true);
            $this->merge([
                'documents' => json_last_error() === JSON_ERROR_NONE && is_array($decoded) ? $decoded : [],
            ]);
        }

        $managed = $this->route('managed_staff');
        if ($managed === null && $this->string('staff_number_source')->toString() === 'auto') {
            $this->merge(['staff_number' => null]);
        }
    }

    public function authorize(): bool
    {
        $ability = $this->route('managed_staff') instanceof Staff
            ? 'update'
            : 'create';

        return SettingsPermissionName::userCanAny($this->user(), $ability, 'user');
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        /** @var Staff|null $managed */
        $managed = $this->route('managed_staff');
        $user = $managed?->user;

        $requiresDoctorProfessionalFields = $this->requiresDoctorProfessionalFields();

        $isCreate = $managed === null;
        $manualStaffNumber = $isCreate && $this->string('staff_number_source')->toString() === 'manual';

        return [
            'staff_number_source' => [
                Rule::requiredIf($isCreate),
                Rule::excludeIf(! $isCreate),
                Rule::in(['auto', 'manual']),
            ],
            'staff_number' => [
                Rule::requiredIf(fn () => $managed !== null || $manualStaffNumber),
                'nullable',
                'string',
                'max:64',
                Rule::unique('staff', 'staff_number')->ignore($managed?->id),
            ],
            'full_name' => ['required', 'string', 'max:255'],
            'preferred_name' => ['nullable', 'string', 'max:255'],
            'nric_passport' => ['nullable', 'string', 'max:64'],
            'gender' => ['nullable', 'string', Rule::in(['1', '2'])],
            'date_of_birth' => ['nullable', 'date'],
            'nationality' => ['nullable', 'string', 'max:120'],
            'marital_status' => ['nullable', 'string', 'max:32'],
            'photo_path' => ['nullable', 'string', 'max:2048'],

            'mobile_number' => ['nullable', 'string', 'max:32'],
            'alternate_phone' => ['nullable', 'string', 'max:32'],
            'email' => ['nullable', 'email', 'max:255'],
            'address_line_1' => ['nullable', 'string', 'max:255'],
            'address_line_2' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:120'],
            'state' => ['nullable', 'string', 'max:120'],
            'postcode' => ['nullable', 'string', 'max:16'],
            'country' => ['nullable', 'string', 'max:120'],
            'emergency_contact_name' => ['nullable', 'string', 'max:255'],
            'emergency_contact_phone' => ['nullable', 'string', 'max:32'],

            'employee_number' => ['nullable', 'string', 'max:64'],
            'hire_date' => ['nullable', 'date'],
            'confirmation_date' => ['nullable', 'date'],
            'position' => ['nullable', 'string', 'max:255'],
            'department' => ['nullable', 'string', 'max:255'],
            'reporting_manager_id' => [
                'nullable',
                'integer',
                'exists:staff,id',
                ...($managed !== null ? [Rule::not($managed->id)] : []),
            ],
            'employment_type' => ['nullable', 'string', 'max:64'],
            'salary_type' => ['nullable', 'string', 'max:64'],
            'assigned_clinics' => ['nullable', 'array'],
            'assigned_clinics.*' => ['string', 'max:255'],
            'working_hours' => ['nullable', 'string', 'max:255'],
            'employment_status' => ['required', 'string', Rule::in(['active', 'on_leave', 'probation', 'suspended', 'resigned', 'terminated'])],
            'is_active' => ['required', 'boolean'],

            'medical_registration_number' => [
                Rule::requiredIf($requiresDoctorProfessionalFields),
                'nullable',
                'string',
                'max:64',
            ],
            'apc_number' => [
                Rule::requiredIf($requiresDoctorProfessionalFields),
                'nullable',
                'string',
                'max:64',
            ],
            'apc_expiry_date' => ['nullable', 'date'],
            'specialization' => ['nullable', 'string', 'max:255'],
            'qualifications' => ['nullable', 'string'],
            'years_experience' => ['nullable', 'integer', 'min:0', 'max:80'],

            'documents_metadata' => ['nullable', 'string'],
            'enable_login' => ['boolean'],
            'account_email' => [
                Rule::requiredIf($this->boolean('enable_login')),
                'nullable',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user?->id),
            ],
            'is_enabled' => ['required', 'boolean'],
            'password' => [
                Rule::requiredIf(fn () => $this->boolean('enable_login') && $user === null),
                'nullable',
                'string',
                'min:8',
                'confirmed',
            ],
            'role_ids' => ['nullable', 'array'],
            'role_ids.*' => ['integer', 'exists:roles,id'],
        ];
    }

    /**
     * Doctors require MMC registration and APC numbers.
     */
    private function requiresDoctorProfessionalFields(): bool
    {
        $roleIds = $this->input('role_ids', []);

        if (! is_array($roleIds) || $roleIds === []) {
            return str_contains(strtolower((string) $this->input('position')), 'doctor');
        }

        $doctorRoleIds = Role::query()
            ->where('guard_name', 'web')
            ->where('name', 'doctor')
            ->pluck('id')
            ->all();

        return count(array_intersect(array_map('intval', $roleIds), $doctorRoleIds)) > 0;
    }
}
