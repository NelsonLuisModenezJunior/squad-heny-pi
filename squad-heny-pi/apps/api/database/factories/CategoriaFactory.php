<?php

namespace Database\Factories;

use App\Models\Categoria;
use Illuminate\Database\Eloquent\Factories\Factory;

class CategoriaFactory extends Factory
{
    protected $model = Categoria::class;

    public function definition(): array
    {
        $categorias = [
            'Geladeira',
            'Ar Condicionado',
            'TV',
            'Máquina de Lavar',
            'Forno Elétrico',
            'Secadora de Roupas',
            'Fogão a Gás',
            'Micro-ondas',
            'Aspirador de Pó',
            'Liquidificador',
            'Ferro de Passar',
            'Cafeteira Elétrica',
            'Freezer',
            'Outros'
        ];

        return [
            'categoria_nome' => fake()->unique()->randomElement($categorias),
        ];
    }
}