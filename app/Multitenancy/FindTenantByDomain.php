<?php

namespace App\Multitenancy;

use App\Models\Domain;
use Illuminate\Http\Request;
use Spatie\Multitenancy\Contracts\IsTenant;
use Spatie\Multitenancy\TenantFinder\TenantFinder;

class FindTenantByDomain extends TenantFinder
{
    public function findForRequest(Request $request): ?IsTenant
    {
        $host = $request->getHost();

        $domain = Domain::query()
            ->where('domain', $host)
            ->first();

        return $domain?->tenant;
    }
}
