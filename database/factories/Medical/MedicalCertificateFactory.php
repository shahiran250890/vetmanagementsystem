<?php

namespace Database\Factories\Medical;

use App\Enums\Medical\MedicalCertificateStatus;
use App\Models\Medical\MedicalCertificate;
use App\Models\Medical\MedicalRecord;
use App\Models\Patients\Patient;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MedicalCertificate>
 */
class MedicalCertificateFactory extends Factory
{
    protected $model = MedicalCertificate::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $from = fake()->dateTimeBetween('-1 week', 'now');
        $to = (clone $from)->modify('+'.fake()->numberBetween(0, 5).' days');

        return [
            'patient_id' => Patient::factory(),
            'medical_record_id' => null,
            'doctor_id' => User::factory(),
            'certificate_number' => null,
            'employer_name' => fake()->optional()->company(),
            'unfit_from' => $from->format('Y-m-d'),
            'unfit_to' => $to->format('Y-m-d'),
            'remarks' => fake()->optional()->sentence(),
            'status' => MedicalCertificateStatus::Draft,
            'issued_at' => null,
            'voided_at' => null,
            'void_reason' => null,
        ];
    }

    public function issued(): static
    {
        return $this->state(fn (): array => [
            'status' => MedicalCertificateStatus::Issued,
            'issued_at' => now(),
            'certificate_number' => null,
        ])->afterCreating(function (MedicalCertificate $certificate): void {
            if ($certificate->certificate_number === null) {
                $certificate->update([
                    'certificate_number' => sprintf('MC-%s-%06d', $certificate->issued_at?->format('Y') ?? date('Y'), $certificate->id),
                ]);
            }
        });
    }

    public function forPatient(Patient $patient): static
    {
        return $this->state(fn (): array => [
            'patient_id' => $patient->id,
        ]);
    }

    public function forDoctor(User $user): static
    {
        return $this->state(fn (): array => [
            'doctor_id' => $user->id,
        ]);
    }

    public function withMedicalRecord(MedicalRecord $record): static
    {
        return $this->state(fn (): array => [
            'patient_id' => $record->patient_id,
            'medical_record_id' => $record->id,
            'doctor_id' => $record->doctor_id,
        ]);
    }
}
