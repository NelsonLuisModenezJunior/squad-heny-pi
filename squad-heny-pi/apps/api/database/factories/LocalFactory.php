<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Local>
 */
class LocalFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'local_nome' => fake()->company(),
            'local_cidade' => fake()->city(),
            'local_endereco' => fake()->streetAddress(),
            'local_numero' => fake()->buildingNumber(),
            'local_desc' => fake()->sentence(),
            'estado_id' => fake()->numberBetween(1, 27)
        ];
    }
}
