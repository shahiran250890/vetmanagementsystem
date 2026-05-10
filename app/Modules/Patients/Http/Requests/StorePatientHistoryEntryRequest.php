<?php

namespace App\Modules\Patients\Http\Requests;

use App\Models\Patients\Patient;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StorePatientHistoryEntryRequest extends FormRequest
{
    public function authorize(): bool
    {
        $patient = $this->route('patient');

        if (! $patient instanceof Patient) {
            return false;
        }

        return $this->user()?->can('update', $patient) ?? false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'entry_date' => ['required', 'date'],
            'visit_case_number' => ['prohibited'],
            'visit_at' => ['required', 'date'],
            'clinic_location' => ['nullable', 'string', 'max:255'],
            'veterinarian_user_id' => ['nullable', 'integer', 'exists:users,id'],
            'assistant_user_id' => ['nullable', 'integer', 'exists:users,id'],
            'visit_type' => ['required', 'string', 'max:255'],
            'appointment_id' => ['nullable', 'string', 'max:255'],
            'visit_status' => ['required', 'string', 'in:waiting,in_progress,completed,cancelled'],
            'entry_type' => ['nullable', 'string', 'max:255'],
            'title' => ['required', 'string', 'max:255'],
            'symptoms' => ['nullable', 'string'],
            'diagnosis' => ['nullable', 'string'],
            'details' => ['nullable', 'string'],
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $symptoms = trim((string) $this->input('symptoms', ''));
            $details = trim((string) $this->input('details', ''));
            $diagnosis = trim((string) $this->input('diagnosis', ''));
            $visitStatus = (string) $this->input('visit_status', '');

            if ($symptoms === '' && $details === '') {
                $validator->errors()->add(
                    'symptoms',
                    'Please provide symptoms or legacy details.',
                );
            }

            if ($visitStatus === 'completed' && $diagnosis === '') {
                $validator->errors()->add(
                    'diagnosis',
                    'Please provide diagnosis before completing the visit.',
                );
            }
        });
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'entry_date.required' => 'Please provide an entry date.',
            'visit_at.required' => 'Please provide visit date and time.',
            'visit_type.required' => 'Please provide visit type.',
            'visit_status.required' => 'Please provide visit status.',
            'title.required' => 'Please provide a title for this history entry.',
        ];
    }
}
