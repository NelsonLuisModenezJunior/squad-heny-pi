<?php

namespace Database\Factories;

use App\Models\Categoria;
use App\Models\Eletro;
use Illuminate\Database\Eloquent\Factories\Factory;

class EletroFactory extends Factory
{
    protected $model = Eletro::class;

    public function definition(): array
    {
        $eletrodomesticos = [
            'Geladeira',
            'Fogão',
            'Micro-ondas',
            'Máquina de Lavar',
            'Ar Condicionado',
            'Aspirador de Pó',
            'Liquidificador',
            'Cafeteira',
            'Torradeira',
            'Secadora',
        ];

        return [
            'categoria_id' => Categoria::factory(),
            'comodo_id' => \App\Models\Comodo::factory(),
            'eletro_nome' => fake()->randomElement($eletrodomesticos) . ' ' . fake()->word(),
            'eletro_potencia' => fake()->randomFloat(2, 100, 3000),
            'eletro_hrs_uso_dia' => fake()->numberBetween(1, 24),
            'eletro_mensal_kwh' => fake()->randomFloat(2, 1, 500),
            'eletro_anual_kwh' => fake()->randomFloat(2, 12, 6000),
            'eletro_custo_mensal' => fake()->randomFloat(2, 5, 200),
            'eletro_custo_anual' => fake()->randomFloat(2, 60, 2400),
            'eletro_emissao_co2_anual' => fake()->randomFloat(2, 10, 1000),
        ];
    }
}