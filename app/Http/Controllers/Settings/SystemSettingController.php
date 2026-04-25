<?php

namespace App\Http\Controllers\Settings;

use App\Concerns\HasResourcePermission;
use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\SystemSettingRequest;
use App\Models\Settings\SystemSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SystemSettingController extends Controller
{
    use HasResourcePermission;

    protected function resourcePermissionName(): string
    {
        return 'system setting';
    }

    public function index(Request $request): Response
    {
        $this->authorizeResourcePermission('view');
        $search = $request->string('search')->trim()->toString();

        return Inertia::render('settings/system/system-settings/index', [
            'settings' => SystemSetting::query()
                ->when(
                    $search !== '',
                    fn ($query) => $query->where('key', 'like', "%{$search}%")
                        ->orWhere('label', 'like', "%{$search}%")
                )
                ->orderBy('key')
                ->paginate(10)
                ->withQueryString(),
            'filters' => [
                'search' => $search,
            ],
            ...$this->resourcePermissionProps(),
        ]);
    }

    public function create(): Response
    {
        $this->authorizeResourcePermission('create');

        return Inertia::render('settings/system/system-settings/index', [
            'settings' => SystemSetting::query()->orderBy('key')->paginate(10),
            'formMode' => 'create',
            ...$this->resourcePermissionProps(),
        ]);
    }

    public function store(SystemSettingRequest $request): RedirectResponse
    {
        SystemSetting::query()->create($request->validated());

        return to_route('settings.system.system-settings.index');
    }

    public function edit(SystemSetting $system_setting): Response
    {
        $this->authorizeResourcePermission('update');

        return Inertia::render('settings/system/system-settings/index', [
            'settings' => SystemSetting::query()->orderBy('key')->paginate(10),
            'editingSetting' => $system_setting,
            'formMode' => 'edit',
            ...$this->resourcePermissionProps(),
        ]);
    }

    public function update(SystemSettingRequest $request, SystemSetting $system_setting): RedirectResponse
    {
        $system_setting->update($request->validated());

        return to_route('settings.system.system-settings.index');
    }

    public function destroy(SystemSetting $system_setting): RedirectResponse
    {
        $this->authorizeResourcePermission('delete');
        $system_setting->delete();

        return to_route('settings.system.system-settings.index');
    }
}
