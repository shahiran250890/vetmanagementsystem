<?php

namespace Database\Seeders;

use App\Models\Settings\Breed;
use App\Models\Settings\Species;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BreedSeeder extends Seeder
{
    public function run(): void
    {
        $breedsBySpecies = [
            'Canine' => ['Labrador Retriever', 'German Shepherd', 'Poodle', 'Beagle'],
            'Feline' => ['Persian', 'Siamese', 'Maine Coon', 'British Shorthair'],
            'Avian' => ['Budgerigar', 'Cockatiel', 'Lovebird'],
            'Rabbit' => ['Netherland Dwarf', 'Holland Lop', 'Mini Rex'],
            'Hamster' => ['Syrian', 'Campbell Dwarf', 'Roborovski'],
        ];

        foreach ($breedsBySpecies as $speciesName => $breeds) {
            $species = Species::query()->where('name', $speciesName)->first();

            if ($species === null) {
                continue;
            }

            foreach ($breeds as $breedName) {
                Breed::query()->firstOrCreate(
                    [
                        'species_id' => $species->id,
                        'name' => $breedName,
                    ],
                    [
                        'code' => Str::upper(Str::slug($speciesName.'-'.$breedName, '_')),
                        'is_enabled' => true,
                    ],
                );
            }
        }
    }
}
