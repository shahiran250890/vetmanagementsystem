<?php

use App\Http\Middleware\VerifyInternalSetupToken;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

test('internal setup middleware allows valid bearer token', function () {
    $token = 'dynamic-access-token';
    Cache::put('internal_setup_access_token:'.hash('sha256', $token), true, now()->addMinute());

    $request = Request::create('/api/internal/tenant-setup/tenants/test/migrations', 'POST');
    $request->headers->set('Authorization', 'Bearer '.$token);

    $middleware = new VerifyInternalSetupToken;
    $response = $middleware->handle($request, fn () => response()->json(['ok' => true]));

    expect($response->getStatusCode())->toBe(200);
});

test('internal setup middleware rejects invalid bearer token', function () {
    $request = Request::create('/api/internal/tenant-setup/tenants/test/migrations', 'POST');
    $request->headers->set('Authorization', 'Bearer invalid.token');

    $middleware = new VerifyInternalSetupToken;
    $response = $middleware->handle($request, fn (): Response => response()->json(['ok' => true]));

    expect($response->getStatusCode())->toBe(401);
});

test('internal setup token endpoint issues dynamic access token', function () {
    config()->set('internal_setup.issuer', 'tenant-management');
    config()->set('internal_setup.shared_secret', 'secret-key');

    $issuer = 'tenant-management';
    $timestamp = time();
    $signature = hash_hmac('sha256', "{$issuer}|{$timestamp}", 'secret-key');

    $response = $this->postJson('/api/internal/tenant-setup/token', [], [
        'X-Internal-Setup-Issuer' => $issuer,
        'X-Internal-Setup-Timestamp' => (string) $timestamp,
        'X-Internal-Setup-Signature' => $signature,
    ]);

    $response->assertSuccessful();
    $response->assertJsonStructure(['ok', 'stage', 'message', 'access_token', 'token_type', 'expires_in']);
});
