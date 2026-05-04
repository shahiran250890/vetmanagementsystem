<?php

namespace App\Modules\Billing\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Responses\BaseApiResponse;
use App\Models\Billing\Bill;
use App\Models\Billing\Payment;
use App\Modules\Billing\Application\Services\PaymentService;
use App\Modules\Billing\Http\Requests\StorePaymentRequest;
use App\Modules\Billing\Http\Resources\PaymentResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaymentApiController extends Controller
{
    public function __construct(
        protected PaymentService $paymentService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Payment::class);

        $query = Payment::query()->with(['bill.patient']);

        if ($request->filled('bill_id')) {
            $bill = Bill::query()->findOrFail((int) $request->input('bill_id'));
            $this->authorize('view', $bill);
            $query->where('bill_id', $bill->id);
        }

        $paginator = $query->orderByDesc('paid_at')->paginate(
            min(100, max(1, (int) $request->input('per_page', 15))),
        )->withQueryString();

        return BaseApiResponse::success(
            PaymentResource::collection($paginator),
            'Payments retrieved.',
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

    public function store(StorePaymentRequest $request): JsonResponse
    {
        $bill = Bill::query()->findOrFail((int) $request->validated('bill_id'));

        $this->authorize('view', $bill);

        $payment = $this->paymentService->create($bill, $request->validated());

        return BaseApiResponse::success(
            PaymentResource::make($payment),
            'Payment recorded.',
        );
    }

    public function show(Payment $payment): JsonResponse
    {
        $this->authorize('view', $payment);

        $payment->load(['bill.patient']);

        return BaseApiResponse::success(
            PaymentResource::make($payment),
            'Payment retrieved.',
        );
    }
}
