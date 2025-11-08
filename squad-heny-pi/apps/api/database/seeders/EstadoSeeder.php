<?php

namespace Database\Seeders;

use App\Models\Estado;
use Illuminate\Database\Seeder;

class EstadoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $estados = [
            ['estado_nome' => 'Acre', 'estado_uf' => 'AC'],
            ['estado_nome' => 'Alagoas', 'estado_uf' => 'AL'],
            ['estado_nome' => 'Amapá', 'estado_uf' => 'AP'],
            ['estado_nome' => 'Amazonas', 'estado_uf' => 'AM'],
            ['estado_nome' => 'Bahia', 'estado_uf' => 'BA'],
            ['estado_nome' => 'Ceará', 'estado_uf' => 'CE'],
            ['estado_nome' => 'Distrito Federal', 'estado_uf' => 'DF'],
            ['estado_nome' => 'Espírito Santo', 'estado_uf' => 'ES'],
            ['estado_nome' => 'Goiás', 'estado_uf' => 'GO'],
            ['estado_nome' => 'Maranhão', 'estado_uf' => 'MA'],
            ['estado_nome' => 'Mato Grosso', 'estado_uf' => 'MT'],
            ['estado_nome' => 'Mato Grosso do Sul', 'estado_uf' => 'MS'],
            ['estado_nome' => 'Minas Gerais', 'estado_uf' => 'MG'],
            ['estado_nome' => 'Pará', 'estado_uf' => 'PA'],
            ['estado_nome' => 'Paraíba', 'estado_uf' => 'PB'],
            ['estado_nome' => 'Paraná', 'estado_uf' => 'PR'],
            ['estado_nome' => 'Pernambuco', 'estado_uf' => 'PE'],
            ['estado_nome' => 'Piauí', 'estado_uf' => 'PI'],
            ['estado_nome' => 'Rio de Janeiro', 'estado_uf' => 'RJ'],
            ['estado_nome' => 'Rio Grande do Norte', 'estado_uf' => 'RN'],
            ['estado_nome' => 'Rio Grande do Sul', 'estado_uf' => 'RS'],
            ['estado_nome' => 'Rondônia', 'estado_uf' => 'RO'],
            ['estado_nome' => 'Roraima', 'estado_uf' => 'RR'],
            ['estado_nome' => 'Santa Catarina', 'estado_uf' => 'SC'],
            ['estado_nome' => 'São Paulo', 'estado_uf' => 'SP'],
            ['estado_nome' => 'Sergipe', 'estado_uf' => 'SE'],
            ['estado_nome' => 'Tocantins', 'estado_uf' => 'TO'],
        ];

        foreach ($estados as $estado) {
            Estado::create($estado);
        }
    }
}
