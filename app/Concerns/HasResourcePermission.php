<?php

namespace App\Concerns;

use Illuminate\Support\Str;
use Throwable;

trait HasResourcePermission
{
    abstract protected function resourcePermissionName(): string;

    protected function authorizeResourcePermission(string $ability): void
    {
        $permission = "{$ability} {$this->resourcePermissionName()}";
        $can = false;

        try {
            $can = auth()->user()?->can($permission) ?? false;
        } catch (Throwable) {
            $can = false;
        }

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
            "canView{$studly}" => auth()->user()?->can("view {$resource}") ?? false,
            "canCreate{$studly}" => auth()->user()?->can("create {$resource}") ?? false,
            "canUpdate{$studly}" => auth()->user()?->can("update {$resource}") ?? false,
            "canDelete{$studly}" => auth()->user()?->can("delete {$resource}") ?? false,
        ];
    }
}
