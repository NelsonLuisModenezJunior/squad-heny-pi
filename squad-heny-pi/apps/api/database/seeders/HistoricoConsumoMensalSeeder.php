<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\HistoricoConsumoMensal;
use App\Models\Local;
use Carbon\Carbon;

class HistoricoConsumoMensalSeeder extends Seeder
{
    /**
     * Popula histórico de consumo dos últimos 6 meses para cada local
     */
    public function run(): void
    {
        $locais = Local::with('tarifa')->get();

        if ($locais->isEmpty()) {
            $this->command->warn('Nenhum local encontrado. Execute o seeder de locais primeiro.');
            return;
        }

        $now = Carbon::now();
        
        foreach ($locais as $local) {
            $this->command->info("Gerando histórico para: {$local->local_nome}");
            
            $tarifaValor = $local->tarifa ? $local->tarifa->tarifa_valor : 0.92;
            
            // Gerar dados dos últimos 5 meses
            for ($i = 5; $i >= 1; $i--) {
                $data = $now->copy()->subMonths($i);
                $mes = $data->month;
                $ano = $data->year;

                // Consumo entre 200-400 kWh/mês
                $consumoBase = rand(200, 400);

                $consumoTotal = $consumoBase;
                
                // Custo baseado na tarifa do local
                $custoTotal = $consumoTotal * $tarifaValor;
                

                $emissaoCo2 = $consumoTotal * 0.0817;

                HistoricoConsumoMensal::create([
                    'local_id' => $local->id,
                    'mes' => $mes,
                    'ano' => $ano,
                    'consumo_total' => round($consumoTotal, 2),
                    'custo_total' => round($custoTotal, 2),
                    'emissao_co2' => round($emissaoCo2, 2),
                ]);

                $this->command->info("  - {$data->format('M/Y')}: {$consumoTotal} kWh, R$ {$custoTotal}");
            }
        }

        $this->command->info('Histórico de consumo gerado com sucesso!');
    }
}
