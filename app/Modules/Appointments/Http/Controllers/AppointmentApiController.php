<?php

namespace App\Modules\Appointments\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Responses\BaseApiResponse;
use App\Models\Appointments\Appointment;
use App\Modules\Appointments\Application\Services\AppointmentService;
use App\Modules\Appointments\Domain\DTOs\AppointmentListFilterDto;
use App\Modules\Appointments\Http\Requests\StoreAppointmentRequest;
use App\Modules\Appointments\Http\Requests\UpdateAppointmentRequest;
use App\Modules\Appointments\Http\Resources\AppointmentResource;
use App\Modules\Appointments\Infrastructure\AppointmentRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AppointmentApiController extends Controller
{
    public function __construct(
        protected AppointmentRepository $appointmentRepository,
        protected AppointmentService $appointmentService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Appointment::class);

        $paginator = $this->appointmentRepository->paginateWithFilters(
            AppointmentListFilterDto::fromRequest($request),
            $request->user(),
        );

        return BaseApiResponse::success(
            AppointmentResource::collection($paginator),
            'Appointments retrieved.',
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

    public function store(StoreAppointmentRequest $request): JsonResponse
    {
        $appointment = $this->appointmentService->create($request->validated());

        return BaseApiResponse::success(
            AppointmentResource::make($appointment),
            'Appointment created.',
        );
    }

    public function show(Appointment $appointment): JsonResponse
    {
        $this->authorize('view', $appointment);

        $appointment->load(['patient', 'doctor']);

        return BaseApiResponse::success(
            AppointmentResource::make($appointment),
            'Appointment retrieved.',
        );
    }

    public function update(UpdateAppointmentRequest $request, Appointment $appointment): JsonResponse
    {
        $updated = $this->appointmentService->update($appointment, $request->validated());

        return BaseApiResponse::success(
            AppointmentResource::make($updated),
            'Appointment updated.',
        );
    }

    public function destroy(Appointment $appointment): JsonResponse
    {
        $this->authorize('delete', $appointment);

        $appointment->delete();

        return BaseApiResponse::success([], 'Appointment deleted.');
    }
}
