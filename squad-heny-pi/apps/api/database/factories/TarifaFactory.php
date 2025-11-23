<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Tarifa>
 */
class TarifaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'tarifa_valor' => fake()->randomFloat(4, 0.5, 1.5) // Valores entre R$ 0.50 e R$ 1.50 por kWh
        ];
    }
}
