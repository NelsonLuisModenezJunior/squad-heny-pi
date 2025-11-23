<?php

namespace App\Services;

use App\Models\HistoricoConsumoMensal;
use App\Models\Local;
use Carbon\Carbon;

class HistoricoConsumoService
{
    private const FATOR_EMISSAO_CO2 = 0.0817;

    /**
     * Calcula e consolida o consumo de um local para um mês específico
     */
    public function consolidarMes(int $localId, int $mes, int $ano): ?HistoricoConsumoMensal
    {
        $local = Local::with(['eletros', 'tarifa'])->find($localId);

        if (!$local || !$local->tarifa) {
            return null;
        }

        // Calcular número de dias no mês
        $diasNoMes = Carbon::create($ano, $mes, 1)->daysInMonth;

        $consumoTotal = 0;

        foreach ($local->eletros as $eletro) {
            // (Potência em W * horas/dia * dias no mês) / 1000 = kWh
            $consumoKwh = ($eletro->eletro_potencia * $eletro->eletro_hrs_uso_dia * $diasNoMes) / 1000;
            $consumoTotal += $consumoKwh;
        }

        $custoTotal = $consumoTotal * $local->tarifa->tarifa_valor;


        $emissaoCo2 = $consumoTotal * self::FATOR_EMISSAO_CO2;


        return HistoricoConsumoMensal::updateOrCreate(
            [
                'local_id' => $localId,
                'mes' => $mes,
                'ano' => $ano,
            ],
            [
                'consumo_total' => round($consumoTotal, 2),
                'custo_total' => round($custoTotal, 2),
                'emissao_co2' => round($emissaoCo2, 2),
            ]
        );
    }

    /**
     * Retorna o histórico dos últimos N meses de um local
     */
    public function getHistoricoLocal(int $localId, int $limiteMeses = 6): array
    {
        $historico = HistoricoConsumoMensal::where('local_id', $localId)
            ->orderBy('ano', 'desc')
            ->orderBy('mes', 'desc')
            ->limit($limiteMeses)
            ->get()
            ->reverse()
            ->values();

        return $historico->map(function ($item) {
            return [
                'mes' => $this->formatarMesAno($item->mes, $item->ano),
                'consumo' => (float) $item->consumo_total,
                'custo' => (float) $item->custo_total,
                'co2' => (float) $item->emissao_co2,
                'mes_numero' => $item->mes,
                'ano' => $item->ano,
            ];
        })->toArray();
    }

    /**
     * Calcula o consumo do mês atual em tempo real (não consolidado)
     */
    public function calcularMesAtual(int $localId): ?array
    {
        $now = Carbon::now();
        $mes = $now->month;
        $ano = $now->year;

        $local = Local::with(['eletros', 'tarifa'])->find($localId);

        if (!$local || !$local->tarifa) {
            return null;
        }

        $diasNoMes = $now->daysInMonth;
        $consumoTotal = 0;

        foreach ($local->eletros as $eletro) {
            $consumoKwh = ($eletro->eletro_potencia * $eletro->eletro_hrs_uso_dia * $diasNoMes) / 1000;
            $consumoTotal += $consumoKwh;
        }

        $custoTotal = $consumoTotal * $local->tarifa->tarifa_valor;
        $emissaoCo2 = $consumoTotal * self::FATOR_EMISSAO_CO2;

        return [
            'mes' => $this->formatarMesAno($mes, $ano),
            'consumo' => round($consumoTotal, 2),
            'custo' => round($custoTotal, 2),
            'co2' => round($emissaoCo2, 2),
            'mes_numero' => $mes,
            'ano' => $ano,
            'is_mes_atual' => true,
        ];
    }

    /**
     * Retorna histórico completo incluindo o mês atual
     */
    public function getHistoricoCompleto(int $localId, int $limiteMeses = 6): array
    {
        $historico = $this->getHistoricoLocal($localId, $limiteMeses - 1);
        $mesAtual = $this->calcularMesAtual($localId);

        if ($mesAtual) {
            $historico[] = $mesAtual;
        }

        return array_slice($historico, -$limiteMeses);
    }

    /**
     * Consolida todos os meses anteriores que ainda não foram consolidados
     */
    public function consolidarMesesPendentes(int $localId): int
    {
        $local = Local::find($localId);
        if (!$local) {
            return 0;
        }

        $now = Carbon::now();
        $dataInicio = Carbon::parse($local->created_at);
        $mesesConsolidados = 0;

        // Iterar por cada mês desde a criação até o mês passado
        while ($dataInicio->lessThan($now->copy()->startOfMonth())) {
            $mes = $dataInicio->month;
            $ano = $dataInicio->year;

            // Verificar se já existe histórico para este mês
            $existe = HistoricoConsumoMensal::where('local_id', $localId)
                ->where('mes', $mes)
                ->where('ano', $ano)
                ->exists();

            if (!$existe) {
                $this->consolidarMes($localId, $mes, $ano);
                $mesesConsolidados++;
            }

            $dataInicio->addMonth();
        }

        return $mesesConsolidados;
    }

    //formatado para exibição
    private function formatarMesAno(int $mes, int $ano): string
    {
        $meses = [
            1 => 'Jan', 2 => 'Fev', 3 => 'Mar', 4 => 'Abr',
            5 => 'Mai', 6 => 'Jun', 7 => 'Jul', 8 => 'Ago',
            9 => 'Set', 10 => 'Out', 11 => 'Nov', 12 => 'Dez'
        ];

        return $meses[$mes] . '/' . $ano;
    }
}
