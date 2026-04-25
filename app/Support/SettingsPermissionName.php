<?php

namespace App\Support;

use Illuminate\Contracts\Auth\Access\Authorizable;
use Illuminate\Support\Str;
use Throwable;

class SettingsPermissionName
{
    /**
     * @var array<string, string>
     */
    private const RESOURCE_PREFIX_MAP = [
        'system setting' => 'settings.system.system_settings',
        'user' => 'settings.system.users',
        'species' => 'settings.system.species',
        'breed' => 'settings.system.breeds',
        'role' => 'settings.system.roles',
        'permission' => 'settings.system.permissions',
    ];

    /**
     * @var list<string>
     */
    private const ABILITIES = ['view', 'create', 'update', 'delete'];

    public static function canonicalFromResourceAbility(string $ability, string $resource): string
    {
        $normalizedAbility = Str::of($ability)->lower()->trim()->toString();
        $normalizedResource = Str::of($resource)->lower()->squish()->toString();

        if (str_contains($normalizedResource, '.')) {
            return "{$normalizedResource}.{$normalizedAbility}";
        }

        $resourcePrefix = self::RESOURCE_PREFIX_MAP[$normalizedResource]
            ?? 'settings.system.'.Str::of($normalizedResource)->replace(' ', '_')->plural()->toString();

        return "{$resourcePrefix}.{$normalizedAbility}";
    }

    public static function legacyFromResourceAbility(string $ability, string $resource): string
    {
        return Str::of($ability)->lower()->trim()->toString().' '.Str::of($resource)->lower()->squish()->toString();
    }

    public static function canonicalFromLegacyPermission(string $permission): ?string
    {
        $normalized = Str::of($permission)->lower()->squish()->toString();
        $parts = explode(' ', $normalized, 2);

        if (count($parts) !== 2) {
            return null;
        }

        [$ability, $resource] = $parts;

        if (! in_array($ability, self::ABILITIES, true)) {
            return null;
        }

        return self::canonicalFromResourceAbility($ability, $resource);
    }

    /**
     * @return array{canonical: string, legacy: string}
     */
    public static function aliasesForAbility(string $ability, string $resource): array
    {
        return [
            'canonical' => self::canonicalFromResourceAbility($ability, $resource),
            'legacy' => self::legacyFromResourceAbility($ability, $resource),
        ];
    }

    public static function userCanAny(?Authorizable $user, string $ability, string $resource): bool
    {
        if ($user === null) {
            return false;
        }

        // TODO: Remove legacy alias checks after all tenants complete permission migration rollout.
        $aliases = self::aliasesForAbility($ability, $resource);

        try {
            return $user->can($aliases['canonical']) || $user->can($aliases['legacy']);
        } catch (Throwable) {
            return false;
        }
    }

    public static function normalizePermissionInput(string $value): string
    {
        $normalized = Str::of($value)->lower()->squish()->toString();
        $canonicalFromLegacy = self::canonicalFromLegacyPermission($normalized);

        if ($canonicalFromLegacy !== null) {
            return $canonicalFromLegacy;
        }

        return $normalized;
    }

    /**
     * @return array<string, string>
     */
    public static function legacyToCanonicalMap(): array
    {
        $map = [];

        foreach (self::RESOURCE_PREFIX_MAP as $resource => $prefix) {
            foreach (self::ABILITIES as $ability) {
                $map[self::legacyFromResourceAbility($ability, $resource)] = "{$prefix}.{$ability}";
            }
        }

        return $map;
    }
}
