<?php

namespace App\Modules\Medical\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Responses\BaseApiResponse;
use App\Models\Medical\MedicalRecord;
use App\Modules\Medical\Application\Services\MedicalRecordService;
use App\Modules\Medical\Domain\DTOs\MedicalRecordListFilterDto;
use App\Modules\Medical\Http\Requests\StoreMedicalRecordRequest;
use App\Modules\Medical\Http\Requests\UpdateMedicalRecordRequest;
use App\Modules\Medical\Http\Resources\MedicalRecordResource;
use App\Modules\Medical\Infrastructure\MedicalRecordRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MedicalRecordApiController extends Controller
{
    public function __construct(
        protected MedicalRecordRepository $medicalRecordRepository,
        protected MedicalRecordService $medicalRecordService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', MedicalRecord::class);

        $paginator = $this->medicalRecordRepository->paginateWithFilters(
            MedicalRecordListFilterDto::fromRequest($request),
            $request->user(),
        );

        return BaseApiResponse::success(
            MedicalRecordResource::collection($paginator),
            'Medical records retrieved.',
            [
                'pagination' => [
                    'current_page' => $paginator->currentPage(),
                    'last_page' => $paginator->lastPage(),
                    'per_page' => $paginator->perPage(),
                    'total' => $paginator->total(),
                ],
            ],
        );
    }

    public function store(StoreMedicalRecordRequest $request): JsonResponse
    {
        $record = $this->medicalRecordService->create($request->validated());

        return BaseApiResponse::success(
            MedicalRecordResource::make($record),
            'Medical record created.',
        );
    }

    public function show(MedicalRecord $medicalRecord): JsonResponse
    {
        $this->authorize('view', $medicalRecord);

        $medicalRecord->load(['patient', 'doctor', 'appointment', 'prescriptions']);

        return BaseApiResponse::success(
            MedicalRecordResource::make($medicalRecord),
            'Medical record retrieved.',
        );
    }

    public function update(UpdateMedicalRecordRequest $request, MedicalRecord $medicalRecord): JsonResponse
    {
        $updated = $this->medicalRecordService->update($medicalRecord, $request->validated());

        return BaseApiResponse::success(
            MedicalRecordResource::make($updated),
            'Medical record updated.',
        );
    }

    public function destroy(MedicalRecord $medicalRecord): JsonResponse
    {
        $this->authorize('delete', $medicalRecord);

        $medicalRecord->delete();

        return BaseApiResponse::success([], 'Medical record deleted.');
    }
}
