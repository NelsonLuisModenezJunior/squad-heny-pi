<?php

namespace App\Services;

use App\Models\Eletro;

class EficienciaService
{
    /**
     * Calculate efficiency rating based on appliance type and power consumption
     */
    public function calcularClassificacao(Eletro $eletro): string
    {
        $potencia = $eletro->eletro_potencia;
        $categoriaNome = $eletro->categoria?->categoria_nome;
        
        // Get thresholds based on category
        $thresholds = $this->getThresholdsPorCategoria($categoriaNome);
        
        return match(true) {
            $potencia <= $thresholds['A+'] => 'A+',
            $potencia <= $thresholds['A'] => 'A',
            $potencia <= $thresholds['B'] => 'B',
            $potencia <= $thresholds['C'] => 'C',
            $potencia <= $thresholds['D'] => 'D',
            default => 'E'
        };
    }
    
    /**
     * Get power thresholds per appliance category (in Watts)
     */
    private function getThresholdsPorCategoria(?string $categoria): array
    {
        return match(strtolower($categoria ?? '')) {
            'geladeira', 'refrigerador' => [
                'A+' => 80,
                'A' => 120,
                'B' => 160,
                'C' => 200,
                'D' => 250,
            ],
            'ar condicionado' => [
                'A+' => 800,
                'A' => 1000,
                'B' => 1200,
                'C' => 1500,
                'D' => 1800,
            ],
            'televisão', 'tv' => [
                'A+' => 50,
                'A' => 80,
                'B' => 120,
                'C' => 150,
                'D' => 200,
            ],
            'máquina de lavar', 'lavadora' => [
                'A+' => 300,
                'A' => 400,
                'B' => 500,
                'C' => 650,
                'D' => 800,
            ],
            'micro-ondas' => [
                'A+' => 800,
                'A' => 1000,
                'B' => 1200,
                'C' => 1400,
                'D' => 1600,
            ],
            'chuveiro', 'aquecedor' => [
                'A+' => 3000,
                'A' => 4000,
                'B' => 5000,
                'C' => 6000,
                'D' => 7000,
            ],
            'computador', 'notebook' => [
                'A+' => 50,
                'A' => 80,
                'B' => 120,
                'C' => 180,
                'D' => 250,
            ],
            'ventilador' => [
                'A+' => 40,
                'A' => 60,
                'B' => 80,
                'C' => 120,
                'D' => 160,
            ],
            'ferro de passar' => [
                'A+' => 800,
                'A' => 1000,
                'B' => 1200,
                'C' => 1500,
                'D' => 1800,
            ],
            // Default thresholds for unknown categories
            default => [
                'A+' => 100,
                'A' => 150,
                'B' => 200,
                'C' => 300,
                'D' => 400,
            ]
        };
    }
    
    /**
     * Calculate daily energy consumption in kWh
     */
    public function calcularConsumoKwhDia(Eletro $eletro): float
    {
        $potenciaKw = $eletro->eletro_potencia / 1000;
        $horas = $eletro->eletro_hrs_uso_dia ?? 0;
        
        return round($potenciaKw * $horas, 2);
    }
    
    /**
     * Calculate monthly energy consumption in kWh
     */
    public function calcularConsumoKwhMes(Eletro $eletro): float
    {
        return round($this->calcularConsumoKwhDia($eletro) * 30, 2);
    }
    
    /**
     * Calculate annual energy consumption in kWh
     */
    public function calcularConsumoKwhAno(Eletro $eletro): float
    {
        return round($this->calcularConsumoKwhDia($eletro) * 365, 2);
    }
    
    /**
     * Calculate estimated monthly cost
     * 
     * @param float $tarifaKwh Average electricity rate in R$/kWh (default: R$ 0.85)
     */
    public function calcularCustoMensal(Eletro $eletro, float $tarifaKwh = 0.85): float
    {
        return round($this->calcularConsumoKwhMes($eletro) * $tarifaKwh, 2);
    }
    
    /**
     * Calculate estimated annual cost
     * 
     * @param float $tarifaKwh Average electricity rate in R$/kWh (default: R$ 0.85)
     */
    public function calcularCustoAnual(Eletro $eletro, float $tarifaKwh = 0.85): float
    {
        return round($this->calcularConsumoKwhAno($eletro) * $tarifaKwh, 2);
    }
}