<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\Staff;
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

        User::query()->updateOrCreate(
            ['email' => 'superadmin@example.com'],
            [
                'name' => 'Super Admin User',
                'phone' => '01234567899',
                'is_enabled' => true,
                'password' => Hash::make('password'),
                'staff_id' => null,
            ]
        )->syncRoles([$superAdminRole]);

        $this->seedStaffLinkedUser('admin@example.com', [
            'name' => 'Admin User',
            'phone' => '01234567890',
            'is_enabled' => true,
            'password' => Hash::make('password'),
        ], $adminRole, [
            'gender' => '1',
            'marital_status' => 'married',
            'nationality' => 'Malaysia',
            'date_of_birth' => '1988-03-12',
        ]);

        $this->seedStaffLinkedUser('doctor@example.com', [
            'name' => 'Doctor User',
            'is_enabled' => true,
            'password' => Hash::make('password'),
        ], $doctorRole, [
            'gender' => '2',
            'marital_status' => 'single',
            'nationality' => 'Malaysia',
            'date_of_birth' => '1990-07-22',
        ]);

        $this->seedStaffLinkedUser('receptionist@example.com', [
            'name' => 'Receptionist User',
            'phone' => '01234567891',
            'is_enabled' => true,
            'password' => Hash::make('password'),
        ], $receptionistRole, [
            'gender' => '2',
            'marital_status' => 'married',
            'nationality' => 'Singapore',
            'date_of_birth' => '1995-11-05',
        ]);

        $this->seedStaffLinkedUser('nurse@example.com', [
            'name' => 'Nurse User',
            'is_enabled' => true,
            'password' => Hash::make('password'),
        ], $nurseRole, [
            'gender' => '1',
            'marital_status' => 'single',
            'nationality' => 'Malaysia',
            'date_of_birth' => '1993-01-18',
        ]);

        $this->seedStaffLinkedUser('pharmacies@example.com', [
            'name' => 'Pharmacies User',
            'is_enabled' => true,
            'password' => Hash::make('password'),
        ], $pharmaciesRole, [
            'gender' => '1',
            'marital_status' => 'married',
            'nationality' => 'Indonesia',
            'date_of_birth' => '1987-09-30',
        ]);

        $this->seedStaffLinkedUser('user@example.com', [
            'name' => 'Normal User',
            'is_enabled' => true,
            'password' => Hash::make('password'),
        ], $normalUserRole, [
            'gender' => '2',
            'marital_status' => 'single',
            'nationality' => 'Malaysia',
            'date_of_birth' => '1999-04-14',
        ]);

        $existingUsersCount = User::query()->count();
        $randomUsersToCreate = max(0, 10 - $existingUsersCount);

        if ($randomUsersToCreate > 0) {
            User::factory($randomUsersToCreate)->create();
        }
    }

    /**
     * @param  array<string, mixed>  $staffAttributes  Maps to staff form: gender 1|2, marital single|married, nationality from nationalities.name.
     */
    private function seedStaffLinkedUser(string $email, array $userAttributes, Role $role, array $staffAttributes = []): void
    {
        $user = User::query()->where('email', $email)->first();

        $staffPayload = array_merge([
            'full_name' => $userAttributes['name'],
            'email' => $email,
            'mobile_number' => $userAttributes['phone'] ?? null,
        ], $staffAttributes);

        if ($user === null) {
            $staff = Staff::factory()->create($staffPayload);

            User::query()->create(array_merge($userAttributes, [
                'email' => $email,
                'staff_id' => $staff->id,
            ]))->syncRoles([$role]);

            return;
        }

        if ($user->staff_id === null) {
            $staff = Staff::factory()->create($staffPayload);
            $user->update(['staff_id' => $staff->id]);
        }

        $user->update($userAttributes);
        $user->syncRoles([$role]);

        $staff = $user->fresh()?->staff;
        if ($staff !== null) {
            $staff->update($staffPayload);
        }
    }
}
