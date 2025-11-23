<?php

namespace Database\Factories;

use App\Models\Comodo;
use Illuminate\Database\Eloquent\Factories\Factory;

class ComodoFactory extends Factory
{
    protected $model = Comodo::class;

    public function definition(): array
    {
        $comodos = [
            'Sala (estar/TV/jantar)',
            'Quarto/dormitório',
            'Banheiro',
            'Cozinha',
            'Lavanderia/área de serviço',
            'Garagem',
            'Escritório/biblioteca',
            'Academia',
            'Adega',
            'Despensa',
            'Outros',
        ];

        return [
            'comodo_nome' => fake()->unique()->randomElement($comodos),
        ];
    }
}