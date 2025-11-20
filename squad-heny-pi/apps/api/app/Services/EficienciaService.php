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
        // Use stored classification if available
        if (!empty($eletro->classificacao_eficiencia)) {
            return $eletro->classificacao_eficiencia;
        }

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
        // Use stored monthly consumption if available
        if (!is_null($eletro->eletro_mensal_kwh)) {
            return round($eletro->eletro_mensal_kwh, 2);
        }
        
        $consumo = round($this->calcularConsumoKwhDia($eletro) * 30, 2);
        $eletro->eletro_mensal_kwh = $consumo;
        $eletro->save();
        
        return $consumo;
    }
    
    /**
     * Calculate annual energy consumption in kWh
     */
    public function calcularConsumoKwhAno(Eletro $eletro): float
    {
        // Use stored annual consumption if available
        if (!is_null($eletro->eletro_anual_kwh)) {
            return round($eletro->eletro_anual_kwh, 2);
        }
        
        $consumo = round($this->calcularConsumoKwhDia($eletro) * 365, 2);
        $eletro->eletro_anual_kwh = $consumo;
        $eletro->save();
        
        return $consumo;
    }
    
    /**
     * Calculate estimated monthly cost
     * 
     * @param Eletro $eletro
     */
    public function calcularCustoMensal(Eletro $eletro): float
    {
        $tarifaKwh = $this->getTarifaValor($eletro);
        return round($this->calcularConsumoKwhMes($eletro) * $tarifaKwh, 2);
    }
    
    /**
     * Calculate estimated annual cost
     */
    public function calcularCustoAnual(Eletro $eletro): float
    {
        $tarifaKwh = $this->getTarifaValor($eletro);
        return round($this->calcularConsumoKwhAno($eletro) * $tarifaKwh, 2);
    }
    
    /**
     * Get tarifa value from eletro's local
     * 
     * @param Eletro $eletro
     * @return float
     * @throws \Exception if tarifa is not found
     */
    private function getTarifaValor(Eletro $eletro): float
    {
        if (!$eletro->local || !$eletro->local->tarifa) {
            throw new \Exception('Tarifa não encontrada para este eletrodoméstico');
        }
        
        return (float) $eletro->local->tarifa->tarifa_valor;
    }

    /**
     * Calculate total monthly consumption for a collection of appliances
     * 
     * @param \Illuminate\Support\Collection $eletros Collection of Eletro models
     */
    public function calcularConsumoTotalMes($eletros): float
    {
        return round($eletros->sum(fn($eletro) => $this->calcularConsumoKwhMes($eletro)), 2);
    }

    /**
     * Calculate total monthly cost for a collection of appliances
     * 
     * @param \Illuminate\Support\Collection $eletros Collection of Eletro models
     */
    public function calcularCustoTotalMes($eletros): float
    {
        return round($eletros->sum(fn($eletro) => $this->calcularCustoMensal($eletro)), 2);
    }

    /**
     * Get consumption grouped by room (comodo)
     * 
     * @param \Illuminate\Support\Collection $eletros Collection of Eletro models
     * @return array Array of rooms with their consumption
     */
    public function getConsumoPorComodo($eletros): array
    {
        $consumoPorComodo = [];
        
        foreach ($eletros as $eletro) {
            $comodo = $eletro->comodo?->comodo_nome ?? 'Outros';
            
            if (!isset($consumoPorComodo[$comodo])) {
                $consumoPorComodo[$comodo] = 0;
            }
            
            $consumoPorComodo[$comodo] += $this->calcularConsumoKwhMes($eletro);
        }

        // Round values and format for response
        return array_map(function($consumo) {
            return round($consumo, 2);
        }, $consumoPorComodo);
    }

    /**
     * Get efficiency distribution of appliances
     * 
     * @param \Illuminate\Support\Collection $eletros Collection of Eletro models
     * @return array Array with count of appliances per efficiency rating
     */
    public function getDistribuicaoEficiencia($eletros): array
    {
        $distribuicao = [
            'A+' => 0,
            'A' => 0,
            'B' => 0,
            'C' => 0,
            'D' => 0,
            'E' => 0
        ];

        foreach ($eletros as $eletro) {
            $classificacao = $this->calcularClassificacao($eletro);
            $distribuicao[$classificacao]++;
        }

        return $distribuicao;
    }

    /**
     * Calculate efficiency rate (percentage of A/A+ appliances)
     * 
     * @param \Illuminate\Support\Collection $eletros Collection of Eletro models
     * @return float Percentage of efficient appliances
     */
    public function calcularTaxaEficiencia($eletros): float
    {
        if ($eletros->isEmpty()) {
            return 0;
        }

        $eficientes = $eletros->filter(fn($eletro) => 
            in_array($this->calcularClassificacao($eletro), ['A', 'A+'])
        )->count();

        return round(($eficientes / $eletros->count()) * 100, 2);
    }

    /**
     * Calculate weighted average efficiency based on classification
     * 
     * @param \Illuminate\Support\Collection $eletros Collection of Eletro models
     * @return float Weighted average efficiency (0-100)
     */
    public function calcularEficienciaMediaPonderada($eletros): float
    {
        if ($eletros->isEmpty()) {
            return 0;
        }
        
        $pesos = [
            'A+' => 100,
            'A' => 85,
            'B' => 70,
            'C' => 55,
            'D' => 40,
            'E' => 25
        ];
        
        $somaEficiencia = $eletros->sum(function($eletro) use ($pesos) {
            $classificacao = $this->calcularClassificacao($eletro);
            return $pesos[$classificacao] ?? 0;
        });
        
        return round($somaEficiencia / $eletros->count(), 2);
    }

    /**
     * Calculate total annual CO2 emissions for a collection of appliances
     * 
     * @param \Illuminate\Support\Collection $eletros Collection of Eletro models
     * @return float Total CO2 emissions in kg
     */
    /**
     * Calculate annual CO2 emissions for a single appliance
     */
    public function calcularEmissaoCO2Anual(Eletro $eletro): float
    {
        if (!is_null($eletro->eletro_emissao_co2_anual)) {
            return round($eletro->eletro_emissao_co2_anual, 2);
        }
        
        $fatorEmissao = 0.0817; // kg CO2/kWh
        
        $emissao = round($this->calcularConsumoKwhAno($eletro) * $fatorEmissao, 2);
        $eletro->eletro_emissao_co2_anual = $emissao;
        $eletro->save();
        
        return $emissao;
    }

    /**
     * Calculate total annual CO2 emissions for a collection of appliances
     * 
     * @param \Illuminate\Support\Collection $eletros Collection of Eletro models
     * @return float Total CO2 emissions in kg
     */
    public function calcularEmissaoCO2Total($eletros): float
    {
        return round($eletros->sum(function ($eletro) {
            return $this->calcularEmissaoCO2Anual($eletro);
        }), 2);
    }

    public function calcularEmissaoCO2Mensal($eletros): float
    {
        $fatorEmissao = 0.0817; // kg CO2/kWh
        $consumoMensal = $this->calcularConsumoTotalMes($eletros);
        return round($consumoMensal * $fatorEmissao, 2);
    }
}