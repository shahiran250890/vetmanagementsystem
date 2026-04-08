<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class SettingsPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $resources = [
            'system setting',
            'user',
            'species',
            'role',
            'permission',
        ];

        $abilities = ['view', 'create', 'update', 'delete'];

        foreach ($resources as $resource) {
            foreach ($abilities as $ability) {
                Permission::findOrCreate("{$ability} {$resource}", 'web');
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
