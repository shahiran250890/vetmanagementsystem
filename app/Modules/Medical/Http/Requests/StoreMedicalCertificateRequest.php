<?php

namespace App\Modules\Medical\Http\Requests;

use App\Models\Medical\MedicalCertificate;
use App\Models\Patients\Patient;
use App\Models\Settings\OrganizationProfile;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StoreMedicalCertificateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', MedicalCertificate::class) ?? false;
    }

    protected function prepareForValidation(): void
    {
        $medicalRecordId = $this->input('medical_record_id');
        if ($medicalRecordId === '' || $medicalRecordId === null) {
            $this->merge(['medical_record_id' => null]);
        }
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $patient = $this->route('patient');
        if (! $patient instanceof Patient) {
            return [];
        }

        return [
            'medical_record_id' => [
                'nullable',
                'integer',
                Rule::exists('medical_records', 'id')->where('patient_id', $patient->id),
            ],
            'employer_name' => ['nullable', 'string', 'max:255'],
            'unfit_from' => ['required', 'date'],
            'unfit_to' => ['required', 'date'],
            'remarks' => ['nullable', 'string', 'max:5000'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $patient = $this->route('patient');
            if (! $patient instanceof Patient) {
                return;
            }

            if ($patient->patient_type !== 'human') {
                $validator->errors()->add('patient_id', 'Medical certificates can only be issued for human patients.');
            }

            $clinicType = OrganizationProfile::query()->value('clinic_type');
            if ($clinicType === 'vet') {
                $validator->errors()->add('clinic_type', 'Medical certificates are not available for veterinary clinic type.');
            }

            $from = $this->input('unfit_from');
            $to = $this->input('unfit_to');
            if (is_string($from) && is_string($to) && $from !== '' && $to !== '' && $to < $from) {
                $validator->errors()->add('unfit_to', 'The unfit until date must be on or after the unfit from date.');
            }
        });
    }
}
