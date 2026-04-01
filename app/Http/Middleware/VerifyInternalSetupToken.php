<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

class VerifyInternalSetupToken
{
    public function handle(Request $request, Closure $next): Response
    {
        $header = (string) $request->header('Authorization', '');
        if (! str_starts_with($header, 'Bearer ')) {
            return response()->json(['ok' => false, 'message' => 'Missing bearer token.'], 401);
        }

        $token = substr($header, 7);
        if ($token === '') {
            return response()->json(['ok' => false, 'message' => 'Missing access token.'], 401);
        }

        $tokenHash = hash('sha256', $token);
        $cacheKey = 'internal_setup_access_token:'.$tokenHash;

        if (! Cache::has($cacheKey)) {
            return response()->json(['ok' => false, 'message' => 'Invalid or expired access token.'], 401);
        }

        return $next($request);
    }
}
