<?php

namespace Database\Seeders;

use App\Models\Module;
use App\Models\Permission;
use App\Models\Role;
use App\Support\SettingsPermissionName;
use Illuminate\Database\Seeder;

class SettingsPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settingsModule = Module::query()->firstOrCreate(
            ['key' => 'settings'],
            ['name' => 'System Setting', 'is_enabled' => true],
        );

        foreach (SettingsPermissionName::legacyToCanonicalMap() as $permissionName) {
            $permission = Permission::findOrCreate($permissionName, 'web');

            if ($permission->module_id !== $settingsModule->id) {
                $permission->module()->associate($settingsModule);
                $permission->save();
            }
        }

        $roles = ['superadmin', 'admin', 'doctor', 'nurse', 'pharmacies', 'normal user'];

        foreach ($roles as $roleName) {
            Role::findOrCreate($roleName, 'web');
        }

        $superAdminRole = Role::findOrCreate('superadmin', 'web');
        $superAdminRole->syncPermissions(Permission::all());
    }
}
