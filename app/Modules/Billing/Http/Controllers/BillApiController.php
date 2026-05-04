<?php

namespace App\Modules\Billing\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Responses\BaseApiResponse;
use App\Models\Billing\Bill;
use App\Modules\Billing\Application\Services\BillService;
use App\Modules\Billing\Domain\DTOs\BillListFilterDto;
use App\Modules\Billing\Http\Requests\StoreBillRequest;
use App\Modules\Billing\Http\Requests\UpdateBillRequest;
use App\Modules\Billing\Http\Resources\BillResource;
use App\Modules\Billing\Infrastructure\BillRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BillApiController extends Controller
{
    public function __construct(
        protected BillRepository $billRepository,
        protected BillService $billService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Bill::class);

        $paginator = $this->billRepository->paginateWithFilters(BillListFilterDto::fromRequest($request));

        return BaseApiResponse::success(
            BillResource::collection($paginator),
            'Bills retrieved.',
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

    public function store(StoreBillRequest $request): JsonResponse
    {
        $bill = $this->billService->create($request->validated());

        return BaseApiResponse::success(
            BillResource::make($bill),
            'Bill created.',
        );
    }

    public function show(Bill $bill): JsonResponse
    {
        $this->authorize('view', $bill);

        $bill->load(['patient', 'items', 'payments']);

        return BaseApiResponse::success(
            BillResource::make($bill),
            'Bill retrieved.',
        );
    }

    public function update(UpdateBillRequest $request, Bill $bill): JsonResponse
    {
        $updated = $this->billService->update($bill, $request->validated());

        return BaseApiResponse::success(
            BillResource::make($updated),
            'Bill updated.',
        );
    }

    public function destroy(Bill $bill): JsonResponse
    {
        $this->authorize('delete', $bill);

        $bill->delete();

        return BaseApiResponse::success([], 'Bill deleted.');
    }
}
