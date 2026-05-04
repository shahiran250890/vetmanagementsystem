<?php

namespace Database\Seeders;

use App\Models\Module;
use App\Models\Permission;
use App\Models\Role;
use App\Support\SettingsPermissionName;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;

class SettingsPermissionSeeder extends Seeder
{
    /**
     * Roles aligned with API middleware (`routes/api.php`) and clinic policies.
     *
     * @var list<string>
     */
    private const CLINIC_STAFF_ROLES = [
        'superadmin',
        'admin',
        'doctor',
        'receptionist',
        'nurse',
        'pharmacies',
        'normal user',
    ];

    /**
     * @return list<string>
     */
    private function allCanonicalPermissionNames(): array
    {
        return array_values(array_unique(array_values(SettingsPermissionName::legacyToCanonicalMap())));
    }

    /**
     * Read-only settings access for clinical staff (reference data + directory).
     *
     * @return list<string>
     */
    private function doctorLikeViewOnlyPermissions(): array
    {
        return [
            'settings.system.system_settings.view',
            'settings.system.users.view',
            'settings.system.species.view',
            'settings.system.breeds.view',
        ];
    }

    /**
     * Front desk: roster lookup plus registering or updating client (owner) users.
     *
     * @return list<string>
     */
    private function receptionistPermissions(): array
    {
        return [
            ...$this->doctorLikeViewOnlyPermissions(),
            'settings.system.users.create',
            'settings.system.users.update',
        ];
    }

    /**
     * @return list<string>
     */
    private function pharmaciesViewPermissions(): array
    {
        return [
            'settings.system.system_settings.view',
            'settings.system.users.view',
            'settings.system.species.view',
            'settings.system.breeds.view',
        ];
    }

    /**
     * @param  list<string>  $names
     */
    private function permissionsByNames(array $names): Collection
    {
        return Permission::query()->whereIn('name', $names)->get();
    }

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settingsModule = Module::query()->firstOrCreate(
            ['key' => 'settings'],
            ['name' => 'System Setting', 'is_enabled' => true],
        );

        foreach ($this->allCanonicalPermissionNames() as $permissionName) {
            $permission = Permission::findOrCreate($permissionName, 'web');

            if ($permission->module_id !== $settingsModule->id) {
                $permission->module()->associate($settingsModule);
                $permission->save();
            }
        }

        foreach (self::CLINIC_STAFF_ROLES as $roleName) {
            Role::findOrCreate($roleName, 'web');
        }

        $allSettingsPermissions = Permission::query()
            ->where('module_id', $settingsModule->id)
            ->get();

        Role::findOrCreate('superadmin', 'web')->syncPermissions($allSettingsPermissions);
        Role::findOrCreate('admin', 'web')->syncPermissions($allSettingsPermissions);

        Role::findOrCreate('doctor', 'web')->syncPermissions(
            $this->permissionsByNames($this->doctorLikeViewOnlyPermissions()),
        );

        Role::findOrCreate('nurse', 'web')->syncPermissions(
            $this->permissionsByNames($this->doctorLikeViewOnlyPermissions()),
        );

        Role::findOrCreate('receptionist', 'web')->syncPermissions(
            $this->permissionsByNames($this->receptionistPermissions()),
        );

        Role::findOrCreate('pharmacies', 'web')->syncPermissions(
            $this->permissionsByNames($this->pharmaciesViewPermissions()),
        );

        Role::findOrCreate('normal user', 'web')->syncPermissions([]);
    }
}
