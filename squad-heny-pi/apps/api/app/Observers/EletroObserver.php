<?php

namespace App\Observers;

use App\Models\Eletro;
use App\Services\EficienciaService;

class EletroObserver
{
    /**
     * Handle the Eletro "created" event (after save).
     */
    public function created(Eletro $eletro): void
    {

        $eletro->load('local.tarifa');
        

        $this->calculateAndSave($eletro);
    }

    /**
     * Handle the Eletro "updated" event.
     */
    public function updated(Eletro $eletro): void
    {
        if ($eletro->wasChanged(['eletro_potencia', 'eletro_hrs_uso_dia', 'local_id'])) {
            $eletro->load('local.tarifa');
            $this->calculateAndSave($eletro, true);
        }
    }

    /**
     * Calcula e salva todos os valores usando o EficienciaService
     * @param bool $forceRecalculate Force recalculation of all values
     */
    private function calculateAndSave(Eletro $eletro, bool $forceRecalculate = false): void
    {
        $service = app(EficienciaService::class);
        
        $eletro->load('categoria');
        

        $classificacao = $service->calcularClassificacao($eletro, $forceRecalculate);
        
        $consumoMes = $service->calcularConsumoKwhMes($eletro, $forceRecalculate);
        $consumoAno = $service->calcularConsumoKwhAno($eletro, $forceRecalculate);
        
        $emissaoCO2 = $service->calcularEmissaoCO2Anual($eletro, $forceRecalculate);
        
        if ($eletro->local && $eletro->local->tarifa) {
            $eletro->eletro_custo_mensal = $service->calcularCustoMensal($eletro);
            $eletro->eletro_custo_anual = $service->calcularCustoAnual($eletro);
        }
        $eletro->classificacao_eficiencia = $classificacao;
        $eletro->eletro_mensal_kwh = $consumoMes;
        $eletro->eletro_anual_kwh = $consumoAno;
        $eletro->eletro_emissao_co2_anual = $emissaoCO2;
        
        $eletro->saveQuietly();
    }
}
