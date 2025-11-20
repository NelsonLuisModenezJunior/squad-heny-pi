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
        // Carregar relações necessárias
        $eletro->load('local.tarifa');
        
        // Calcular e atualizar valores usando o service
        $this->calculateAndSave($eletro);
    }

    /**
     * Handle the Eletro "updated" event.
     */
    public function updated(Eletro $eletro): void
    {
        // Recalcula apenas se potência ou horas de uso mudaram
        if ($eletro->wasChanged(['eletro_potencia', 'eletro_hrs_uso_dia', 'local_id'])) {
            $eletro->load('local.tarifa');
            $this->calculateAndSave($eletro);
        }
    }

    /**
     * Calcula e salva todos os valores usando o EficienciaService
     */
    private function calculateAndSave(Eletro $eletro): void
    {
        $service = app(EficienciaService::class);
        
        // Usar os métodos do service para calcular os valores
        // Os métodos já fazem save() internamente
        $service->calcularConsumoKwhMes($eletro);
        $service->calcularConsumoKwhAno($eletro);
        $service->calcularEmissaoCO2Anual($eletro);
        
        // Calcular custos se a tarifa estiver disponível
        if ($eletro->local && $eletro->local->tarifa) {
            $eletro->eletro_custo_mensal = $service->calcularCustoMensal($eletro);
            $eletro->eletro_custo_anual = $service->calcularCustoAnual($eletro);
            $eletro->saveQuietly(); // salva sem disparar eventos novamente
        }
    }
}
