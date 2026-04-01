<?php

namespace App\Http\Controllers\Internal;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Services\InternalTenantSetupService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class TenantSetupController extends Controller
{
    public function __construct(private readonly InternalTenantSetupService $setupService) {}

    public function issueAccessToken(): JsonResponse
    {
        $ttl = (int) config('internal_setup.access_token_ttl_seconds', 120);
        $token = Str::random(80);
        $tokenHash = hash('sha256', $token);

        Cache::put('internal_setup_access_token:'.$tokenHash, true, now()->addSeconds($ttl));

        return response()->json([
            'ok' => true,
            'stage' => 'token',
            'message' => 'Internal setup access token issued successfully.',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'expires_in' => $ttl,
        ]);
    }

    public function createDatabase(Tenant $tenant): JsonResponse
    {
        try {
            $this->setupService->createDatabase($tenant);

            return response()->json([
                'ok' => true,
                'stage' => 'database',
                'message' => 'Tenant database created successfully.',
            ]);
        } catch (\Throwable $exception) {
            report($exception);

            return response()->json([
                'ok' => false,
                'stage' => 'database',
                'message' => $exception->getMessage(),
            ], 500);
        }
    }

    public function runMigrations(Tenant $tenant): JsonResponse
    {
        try {
            $this->setupService->runMigrations($tenant);

            return response()->json([
                'ok' => true,
                'stage' => 'migration',
                'message' => 'Tenant migrations completed successfully.',
            ]);
        } catch (\Throwable $exception) {
            report($exception);

            return response()->json([
                'ok' => false,
                'stage' => 'migration',
                'message' => $exception->getMessage(),
            ], 500);
        }
    }

    public function runSeeders(Tenant $tenant): JsonResponse
    {
        try {
            $this->setupService->runSeeders($tenant);

            return response()->json([
                'ok' => true,
                'stage' => 'seeder',
                'message' => 'Tenant seeders completed successfully.',
            ]);
        } catch (\Throwable $exception) {
            report($exception);

            return response()->json([
                'ok' => false,
                'stage' => 'seeder',
                'message' => $exception->getMessage(),
            ], 500);
        }
    }

    public function ensureUser(Tenant $tenant): JsonResponse
    {
        try {
            $result = $this->setupService->ensureTenantUser($tenant);

            return response()->json([
                'ok' => true,
                'stage' => 'ensure-user',
                'message' => $result === 'seeded'
                    ? 'Tenant user has been created.'
                    : 'Tenant user already exists; skipped.',
                'result' => $result,
            ]);
        } catch (\Throwable $exception) {
            report($exception);

            return response()->json([
                'ok' => false,
                'stage' => 'ensure-user',
                'message' => $exception->getMessage(),
            ], 500);
        }
    }
}
