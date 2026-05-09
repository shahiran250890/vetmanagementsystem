<?php

namespace App\Modules\Medical\Http\Requests;

use App\Models\Medical\MedicalCertificate;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class VoidMedicalCertificateRequest extends FormRequest
{
    public function authorize(): bool
    {
        $certificate = $this->route('medicalCertificate');

        if (! $certificate instanceof MedicalCertificate) {
            return false;
        }

        return $this->user()?->can('void', $certificate) ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'void_reason' => ['required', 'string', 'max:2000'],
        ];
    }
}
