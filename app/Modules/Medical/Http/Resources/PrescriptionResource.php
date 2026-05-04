<?php

namespace App\Modules\Medical\Http\Resources;

use App\Models\Medical\Prescription;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin Prescription */
class PrescriptionResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'medical_record_id' => $this->medical_record_id,
            'medicine_name' => $this->medicine_name,
            'dosage' => $this->dosage,
            'duration' => $this->duration,
            'instructions' => $this->instructions,
        ];
    }
}
