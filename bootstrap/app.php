<?php

use App\Http\Middleware\EnsureTenantIsEnabled;
use App\Http\Middleware\EnsureUserAccountEnabled;
use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\VerifyInternalSetupClientSignature;
use App\Http\Middleware\VerifyInternalSetupToken;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\View\Middleware\ShareErrorsFromSession;
use Spatie\Permission\Middleware\RoleMiddleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        /*
         * Server-to-server tenant provisioning calls POST without a browser session.
         * Those routes use HMAC-signed headers and short-lived bearer tokens instead.
         */
        ValidateCsrfToken::except([
            'api/internal/tenant-setup/*',
        ]);

        /*
         * The clinic SPA authenticates with the same session cookies as the Inertia app.
         * Laravel's default `api` group does not start the session, so `auth` on /api/v1/*
         * would never see a logged-in user. Mirror the web stack's cookie + session + CSRF
         * behaviour for API routes (without Inertia middleware).
         */
        $middleware->api(prepend: [
            EnsureTenantIsEnabled::class,
            EncryptCookies::class,
            AddQueuedCookiesToResponse::class,
            StartSession::class,
            ShareErrorsFromSession::class,
            ValidateCsrfToken::class,
        ]);

        $middleware->web(
            prepend: [
                EnsureTenantIsEnabled::class,
            ],
            append: [
                HandleAppearance::class,
                HandleInertiaRequests::class,
                AddLinkHeadersForPreloadedAssets::class,
                EnsureUserAccountEnabled::class,
            ],
        );

        $middleware->alias([
            'internal.setup.client' => VerifyInternalSetupClientSignature::class,
            'internal.setup.auth' => VerifyInternalSetupToken::class,
            'role' => RoleMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();
