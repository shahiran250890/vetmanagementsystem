<?php

namespace App\Http\Requests\Settings;

use Illuminate\Foundation\Http\FormRequest;

class FileAssetUploadRequest extends FormRequest
{
    /** Laravel file `max` is kilobytes: 11 × 1024 KB ≈ 11 MiB per upload. */
    private const MAX_FILE_SIZE_KB = 11 * 1024;

    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'file' => ['required', 'file', 'max:'.self::MAX_FILE_SIZE_KB],
            'module_name' => ['required', 'string', 'max:120'],
            'record_id' => ['nullable', 'string', 'max:120'],
            'category' => ['nullable', 'string', 'max:120'],
        ];
    }
}
