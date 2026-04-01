<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class VerifyInternalSetupClientSignature
{
    public function handle(Request $request, Closure $next): Response
    {
        $issuer = (string) $request->header('X-Internal-Setup-Issuer', '');
        $timestamp = (int) $request->header('X-Internal-Setup-Timestamp', '0');
        $signature = (string) $request->header('X-Internal-Setup-Signature', '');

        $expectedIssuer = (string) config('internal_setup.issuer', 'tenant-management');
        $secret = (string) config('internal_setup.shared_secret', '');
        $clockSkew = (int) config('internal_setup.allowed_clock_skew_seconds', 60);

        if ($secret === '') {
            return response()->json(['ok' => false, 'message' => 'Internal setup auth is not configured.'], 500);
        }

        if ($issuer === '' || $timestamp <= 0 || $signature === '') {
            return response()->json(['ok' => false, 'message' => 'Missing internal setup signature headers.'], 401);
        }

        if ($issuer !== $expectedIssuer) {
            return response()->json(['ok' => false, 'message' => 'Invalid token issuer.'], 401);
        }

        if (abs(time() - $timestamp) > $clockSkew) {
            return response()->json(['ok' => false, 'message' => 'Signature expired or not yet valid.'], 401);
        }

        $expectedSignature = hash_hmac('sha256', "{$issuer}|{$timestamp}", $secret);
        if (! hash_equals($expectedSignature, $signature)) {
            return response()->json(['ok' => false, 'message' => 'Invalid token signature.'], 401);
        }

        return $next($request);
    }
}
