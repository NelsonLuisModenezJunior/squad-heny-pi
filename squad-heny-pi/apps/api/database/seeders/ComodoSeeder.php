<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Comodo;
use Illuminate\Support\Facades\DB;

class ComodoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $comodos = [
            ['comodo_nome' => 'Sala (estar/TV/jantar)'],
            ['comodo_nome' => 'Quarto/dormitório'],
            ['comodo_nome' => 'Banheiro'],
            ['comodo_nome' => 'Cozinha'],
            ['comodo_nome' => 'Lavanderia/área de serviço'],
            ['comodo_nome' => 'Garagem'],
            ['comodo_nome' => 'Escritório/biblioteca'],
            ['comodo_nome' => 'Academia'],
            ['comodo_nome' => 'Adega'],
            ['comodo_nome' => 'Despensa'],
            ['comodo_nome' => 'Outros'],
        ];

        foreach ($comodos as $comodo) {
            Comodo::create($comodo);
        }
    }
}