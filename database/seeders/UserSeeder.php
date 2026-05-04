<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $superAdminRole = Role::findOrCreate('superadmin', 'web');
        $adminRole = Role::findOrCreate('admin', 'web');
        $doctorRole = Role::findOrCreate('doctor', 'web');
        $receptionistRole = Role::findOrCreate('receptionist', 'web');
        $nurseRole = Role::findOrCreate('nurse', 'web');
        $pharmaciesRole = Role::findOrCreate('pharmacies', 'web');
        $normalUserRole = Role::findOrCreate('normal user', 'web');

        User::query()->updateOrCreate([
            'email' => 'superadmin@example.com',
        ], [
            'name' => 'Super Admin User',
            'phone' => '01234567899',
            'is_enabled' => true,
            'password' => Hash::make('password'),
        ])->syncRoles([$superAdminRole]);

        User::query()->updateOrCreate([
            'email' => 'admin@example.com',
        ], [
            'name' => 'Admin User',
            'phone' => '01234567890',
            'is_enabled' => true,
            'password' => Hash::make('password'),
        ])->syncRoles([$adminRole]);

        User::query()->updateOrCreate([
            'email' => 'doctor@example.com',
        ], [
            'name' => 'Doctor User',
            'is_enabled' => true,
            'password' => Hash::make('password'),
        ])->syncRoles([$doctorRole]);

        User::query()->updateOrCreate([
            'email' => 'receptionist@example.com',
        ], [
            'name' => 'Receptionist User',
            'phone' => '01234567891',
            'is_enabled' => true,
            'password' => Hash::make('password'),
        ])->syncRoles([$receptionistRole]);

        User::query()->updateOrCreate([
            'email' => 'nurse@example.com',
        ], [
            'name' => 'Nurse User',
            'is_enabled' => true,
            'password' => Hash::make('password'),
        ])->syncRoles([$nurseRole]);

        User::query()->updateOrCreate([
            'email' => 'pharmacies@example.com',
        ], [
            'name' => 'Pharmacies User',
            'is_enabled' => true,
            'password' => Hash::make('password'),
        ])->syncRoles([$pharmaciesRole]);

        User::query()->updateOrCreate([
            'email' => 'user@example.com',
        ], [
            'name' => 'Normal User',
            'is_enabled' => true,
            'password' => Hash::make('password'),
        ])->syncRoles([$normalUserRole]);

        $existingUsersCount = User::query()->count();
        $randomUsersToCreate = max(0, 10 - $existingUsersCount);

        if ($randomUsersToCreate > 0) {
            User::factory($randomUsersToCreate)->create();
        }
    }
}
