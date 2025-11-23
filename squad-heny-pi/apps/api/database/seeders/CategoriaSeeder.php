<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Categoria;
use Illuminate\Support\Facades\DB;

class CategoriaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categorias = [
            ['categoria_nome' => 'Geladeira'],
            ['categoria_nome' => 'Ar Condicionado'],
            ['categoria_nome' => 'TV'],
            ['categoria_nome' => 'Máquina de Lavar'],
            ['categoria_nome' => 'Forno Elétrico'],
            ['categoria_nome' => 'Secadora de Roupas'],
            ['categoria_nome' => 'Fogão a Gás'],
            ['categoria_nome' => 'Micro-ondas'],
            ['categoria_nome' => 'Aspirador de Pó'],
            ['categoria_nome' => 'Liquidificador'],
            ['categoria_nome' => 'Ferro de Passar'],
            ['categoria_nome' => 'Cafeteira Elétrica'],
            ['categoria_nome' => 'Freezer'],
            ['categoria_nome' => 'Outros'],
        ];

        foreach ($categorias as $categoria) {
            Categoria::create($categoria);
        }
    }
}