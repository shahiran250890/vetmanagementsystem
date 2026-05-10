<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            SpeciesSeeder::class,
            BreedSeeder::class,
            BloodTypeSeeder::class,
            NationalitySeeder::class,
            SettingsPermissionSeeder::class,
            UserSeeder::class,
            PatientSeeder::class,
        ]);
    }
}
