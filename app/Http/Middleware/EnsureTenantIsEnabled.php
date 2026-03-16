<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Multitenancy\Contracts\IsTenant;
use Spatie\Multitenancy\TenantFinder\TenantFinder;
use Symfony\Component\HttpFoundation\Response;

/**
 * Blocks all web routes unless the request host resolves to an enabled tenant.
 *
 * We resolve the tenant here (if not already bound) to guarantee route access control
 * even if multitenancy bootstrapping changes or is deferred elsewhere.
 */
class EnsureTenantIsEnabled
{
    /**
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $containerKey = (string) config('multitenancy.current_tenant_container_key', 'currentTenant');
        $tenant = app()->bound($containerKey) ? app($containerKey) : null;

        if ($tenant === null) {
            /** @var TenantFinder $tenantFinder */
            $tenantFinder = app(TenantFinder::class);
            $resolvedTenant = $tenantFinder->findForRequest($request);

            if ($resolvedTenant instanceof IsTenant) {
                $resolvedTenant->makeCurrent();
                $tenant = $resolvedTenant;
            }
        }

        if ($tenant === null) {
            abort(404);
        }

        if (($tenant->is_enabled ?? false) !== true) {
            return Inertia::render('errors/tenant-disabled', [
                'title' => 'Site unavailable',
                'message' => 'This site is currently not accessible. Please contact your administrator for assistance.',
            ])->toResponse($request);
        }

        return $next($request);
    }
}
