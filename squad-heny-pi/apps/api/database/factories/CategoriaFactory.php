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
            'Refrigeração',
            'Lavanderia',
            'Cozinha',
            'Climatização',
            'Limpeza',
            'Aquecimento',
            'Pequenos Eletrodomésticos',
        ];

        return [
            'categoria_nome' => fake()->unique()->randomElement($categorias),
        ];
    }
}