<?php

namespace App\Modules\Settings\Http\Controllers;

use App\Concerns\HasResourcePermission;
use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\OrganizationProfileRequest;
use App\Models\Settings\OrganizationProfile;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class OrganizationProfileController extends Controller
{
    use HasResourcePermission;

    protected function resourcePermissionName(): string
    {
        return 'system setting';
    }

    public function edit(): Response
    {
        $this->authorizeResourcePermission('view');

        return Inertia::render('settings/system/organization/index', [
            'organizationProfile' => OrganizationProfile::query()->first(),
            ...$this->resourcePermissionProps(),
        ]);
    }

    public function update(OrganizationProfileRequest $request): RedirectResponse
    {
        $this->authorizeResourcePermission('update');

        $organizationProfile = OrganizationProfile::query()->firstOrNew();
        $organizationProfile->fill($request->validated());
        $organizationProfile->save();

        return to_route('settings.system.organization.edit');
    }
}
