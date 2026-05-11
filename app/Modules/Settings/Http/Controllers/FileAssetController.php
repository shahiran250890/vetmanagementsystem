<?php

namespace App\Modules\Settings\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\FileAssetUploadRequest;
use App\Models\FileAsset;
use App\Modules\Settings\Application\Services\FileAssetStorageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class FileAssetController extends Controller
{
    public function __construct(private readonly FileAssetStorageService $fileAssetStorageService) {}

    public function store(FileAssetUploadRequest $request): JsonResponse
    {
        $upload = $request->file('file');
        if ($upload === null) {
            return response()->json(['message' => 'No file uploaded.'], Response::HTTP_UNPROCESSABLE_ENTITY);
        }

        $stored = $this->fileAssetStorageService->storeUploadedFile(
            $upload,
            $request->string('module_name')->toString(),
            $request->filled('record_id') ? $request->string('record_id')->toString() : null,
            $request->filled('category') ? $request->string('category')->toString() : null,
        );

        $fileAsset = DB::transaction(function () use ($request, $stored): FileAsset {
            return FileAsset::query()->create([
                'module_name' => $request->string('module_name')->toString(),
                'record_id' => $request->filled('record_id') ? $request->string('record_id')->toString() : null,
                'category' => $request->filled('category') ? $request->string('category')->toString() : null,
                'disk' => $stored['disk'],
                'path' => $stored['path'],
                'stored_name' => $stored['stored_name'],
                'original_name' => $stored['original_name'],
                'mime_type' => $stored['mime_type'],
                'size_bytes' => $stored['size_bytes'],
                'uploaded_by_user_id' => $request->user()?->id,
            ]);
        });

        return response()->json([
            'id' => $fileAsset->id,
            'module_name' => $fileAsset->module_name,
            'record_id' => $fileAsset->record_id,
            'category' => $fileAsset->category,
            'name' => $fileAsset->original_name,
            'size' => $fileAsset->size_bytes,
            'mime_type' => $fileAsset->mime_type,
            'view_url' => route('settings.system.files.show', $fileAsset),
            'download_url' => route('settings.system.files.download', $fileAsset),
            'uploaded_at' => $fileAsset->created_at?->toIso8601String(),
        ], Response::HTTP_CREATED);
    }

    public function show(Request $request, FileAsset $fileAsset): StreamedResponse
    {
        if ($request->user() === null) {
            abort(Response::HTTP_FORBIDDEN);
        }

        return $this->streamFromDisk($fileAsset, 'inline');
    }

    public function download(Request $request, FileAsset $fileAsset): StreamedResponse
    {
        if ($request->user() === null) {
            abort(Response::HTTP_FORBIDDEN);
        }

        return $this->streamFromDisk($fileAsset, 'attachment');
    }

    public function destroy(Request $request, FileAsset $fileAsset): JsonResponse
    {
        if ($request->user() === null) {
            abort(Response::HTTP_FORBIDDEN);
        }

        $fileAsset->delete();

        return response()->json(['deleted' => true]);
    }

    private function streamFromDisk(FileAsset $fileAsset, string $disposition): StreamedResponse
    {
        $stream = Storage::disk($fileAsset->disk)->readStream($fileAsset->path);
        if ($stream === false) {
            abort(Response::HTTP_NOT_FOUND);
        }

        $headers = [
            'Content-Type' => $fileAsset->mime_type ?: 'application/octet-stream',
            'Content-Disposition' => $disposition.'; filename="'.$fileAsset->original_name.'"',
        ];

        return response()->stream(function () use ($stream): void {
            fpassthru($stream);
            fclose($stream);
        }, Response::HTTP_OK, $headers);
    }
}
