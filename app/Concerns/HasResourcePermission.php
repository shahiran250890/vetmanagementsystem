<?php

namespace App\Concerns;

use App\Support\SettingsPermissionName;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

trait HasResourcePermission
{
    abstract protected function resourcePermissionName(): string;

    protected function authorizeResourcePermission(string $ability): void
    {
        $can = SettingsPermissionName::userCanAny(Auth::user(), $ability, $this->resourcePermissionName());

        abort_unless($can, 403);
    }

    /**
     * @return array<string, bool>
     */
    protected function resourcePermissionProps(): array
    {
        $resource = $this->resourcePermissionName();
        $studly = Str::studly(str_replace(' ', '_', $resource));

        return [
            "canView{$studly}" => SettingsPermissionName::userCanAny(Auth::user(), 'view', $resource),
            "canCreate{$studly}" => SettingsPermissionName::userCanAny(Auth::user(), 'create', $resource),
            "canUpdate{$studly}" => SettingsPermissionName::userCanAny(Auth::user(), 'update', $resource),
            "canDelete{$studly}" => SettingsPermissionName::userCanAny(Auth::user(), 'delete', $resource),
        ];
    }
}
