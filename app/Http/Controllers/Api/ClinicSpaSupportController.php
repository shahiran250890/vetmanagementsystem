<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Responses\BaseApiResponse;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ClinicSpaSupportController extends Controller
{
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user === null) {
            return BaseApiResponse::error('Unauthenticated.', [], [], 401);
        }

        return BaseApiResponse::success([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'roles' => $user->getRoleNames()->values()->all(),
        ], 'Authenticated.');
    }

    public function doctors(Request $request): JsonResponse
    {
        if (! $request->user()?->hasAnyRole(['admin', 'superadmin', 'doctor', 'receptionist'])) {
            return BaseApiResponse::error('Forbidden.', [], [], 403);
        }

        $query = User::query()
            ->select(['id', 'name', 'email'])
            ->orderBy('name');

        if ($request->user()->hasRole('doctor') && ! $request->user()->hasAnyRole(['admin', 'superadmin', 'receptionist'])) {
            $query->whereKey($request->user()->id);
        } else {
            $query->role('doctor');
        }

        return BaseApiResponse::success(
            $query->get()->all(),
            'Doctors retrieved.',
        );
    }
}
