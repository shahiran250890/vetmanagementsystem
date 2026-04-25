<?php

namespace Database\Seeders;

use App\Models\Settings\Species;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class SpeciesSeeder extends Seeder
{
    public function run(): void
    {
        $species = ['Canine', 'Feline', 'Avian', 'Rabbit', 'Hamster'];

        foreach ($species as $name) {
            Species::query()->firstOrCreate(
                ['name' => $name],
                [
                    'code' => Str::upper(Str::substr($name, 0, 3)),
                    'is_enabled' => true,
                ],
            );
        }
    }
}
