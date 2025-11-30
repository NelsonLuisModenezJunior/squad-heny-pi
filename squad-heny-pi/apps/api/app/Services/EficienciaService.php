<?php

namespace App\Services;

use App\Models\Eletro;

class EficienciaService
{
    // Pesos para cálculo híbrido
    private const PESO_POTENCIA = 0.6;
    private const PESO_CONSUMO = 0.4;
    
    // Scores por classificação
    private const SCORES = [
        'A+' => 100,
        'A' => 85,
        'B' => 70,
        'C' => 55,
        'D' => 40,
        'E' => 25
    ];

    /**
     * Calcula a classificação de eficiência energética do eletrodoméstico baseado em
     * potência e horas de uso diárias
     * @param bool $forceRecalculate Force recalculation even if value exists
     */
    public function calcularClassificacao(Eletro $eletro, bool $forceRecalculate = false): string
    {
        if (!$forceRecalculate && !empty($eletro->classificacao_eficiencia)) {
            return $eletro->classificacao_eficiencia;
        }

        $potencia = $eletro->eletro_potencia;
        $horasUso = $eletro->eletro_hrs_uso_dia ?? 0;
        $categoriaNome = strtolower($eletro->categoria?->categoria_nome ?? '');
        
        // Pega configuração da categoria
        $config = $this->getConfigCategoria($categoriaNome);
        
        // 1. Pontuação da potência 
        $scorePotencia = $this->calcularScorePotencia($potencia, $config['thresholds']);
        
        // 2. Pontuação baseada no consumo
        $scoreConsumo = $this->calcularScoreConsumo($horasUso, $config['horas_tipicas']);
        
        // 3. Pontuação final
        $scoreFinal = ($scorePotencia * self::PESO_POTENCIA) + ($scoreConsumo * self::PESO_CONSUMO);
        
        // Converte pontuação para classificação
        $classificacao = $this->scoreParaClassificacao($scoreFinal);
        
        return $classificacao;
    }
    
    /**
     * Calcula pontuação baseada na potência (0-100)
     */
    private function calcularScorePotencia(float $potencia, array $thresholds): float
    {
        return match(true) {
            $potencia <= $thresholds['A+'] => 100,
            $potencia <= $thresholds['A'] => 85,
            $potencia <= $thresholds['B'] => 70,
            $potencia <= $thresholds['C'] => 55,
            $potencia <= $thresholds['D'] => 40,
            default => 25
        };
    }
    
    /**
     * Calcula a pontuação baseada no consumo comparado com uso típico
     * Se usa menos que o típico: bonus (até +15 pontos)
     * Se usa mais que o típico: penalidade (até -15 pontos)
     */
    private function calcularScoreConsumo(float $horasUso, float $horasTipicas): float
    {
        if ($horasTipicas <= 0) {
            return 70; // Score neutro se não há referência
        }
        
        $razao = $horasUso / $horasTipicas;
        
        // Base score de 70 (equivalente a B)
        // Ajusta +/- 15 pontos baseado na razão de uso
        if ($razao <= 0.5) {
            // Usa metade ou menos do típico: bonus máximo
            return 85;
        } elseif ($razao <= 0.75) {
            // Usa 50-75% do típico: bonus moderado
            return 77;
        } elseif ($razao <= 1.0) {
            // Usa até 100% do típico: score neutro
            return 70;
        } elseif ($razao <= 1.5) {
            // Usa até 150% do típico: penalidade leve
            return 60;
        } else {
            // Usa mais de 150% do típico: penalidade maior
            return 50;
        }
    }
    
    /**
     * Converte score numérico para classificação de letra
     */
    private function scoreParaClassificacao(float $score): string
    {
        return match(true) {
            $score >= 85 => 'A+',
            $score >= 72 => 'A',
            $score >= 58 => 'B',
            $score >= 44 => 'C',
            $score >= 30 => 'D',
            default => 'E'
        };
    }
    
    /**
     * Get configuration per appliance category (thresholds in Watts and typical daily hours)
     */
    private function getConfigCategoria(?string $categoria): array
    {
        return match($categoria) {
            'geladeira', 'refrigerador' => [
                'thresholds' => ['A+' => 80, 'A' => 120, 'B' => 160, 'C' => 200, 'D' => 250],
                'horas_tipicas' => 24.0,
            ],
            'freezer' => [
                'thresholds' => ['A+' => 100, 'A' => 150, 'B' => 200, 'C' => 250, 'D' => 300],
                'horas_tipicas' => 24.0, 
            ],
            'ar condicionado' => [
                'thresholds' => ['A+' => 800, 'A' => 1000, 'B' => 1200, 'C' => 1500, 'D' => 1800],
                'horas_tipicas' => 8.0,
            ],
            'televisão', 'tv' => [
                'thresholds' => ['A+' => 50, 'A' => 80, 'B' => 120, 'C' => 150, 'D' => 200],
                'horas_tipicas' => 5.0,
            ],
            'máquina de lavar', 'lavadora' => [
                'thresholds' => ['A+' => 300, 'A' => 400, 'B' => 500, 'C' => 650, 'D' => 800],
                'horas_tipicas' => 1.0,
            ],
            'secadora de roupas' => [
                'thresholds' => ['A+' => 1500, 'A' => 2000, 'B' => 2500, 'C' => 3500, 'D' => 4500],
                'horas_tipicas' => 1.0,
            ],
            'micro-ondas' => [
                'thresholds' => ['A+' => 800, 'A' => 1000, 'B' => 1200, 'C' => 1400, 'D' => 1600],
                'horas_tipicas' => 0.25,
            ],
            'forno elétrico' => [
                'thresholds' => ['A+' => 1000, 'A' => 1500, 'B' => 2000, 'C' => 2500, 'D' => 3000],
                'horas_tipicas' => 0.5,
            ],
            'ferro de passar' => [
                'thresholds' => ['A+' => 800, 'A' => 1000, 'B' => 1200, 'C' => 1500, 'D' => 1800],
                'horas_tipicas' => 0.5,
            ],
            'aspirador de pó' => [
                'thresholds' => ['A+' => 800, 'A' => 1200, 'B' => 1600, 'C' => 2000, 'D' => 2500],
                'horas_tipicas' => 0.33,
            ],
            'liquidificador' => [
                'thresholds' => ['A+' => 300, 'A' => 500, 'B' => 700, 'C' => 900, 'D' => 1200],
                'horas_tipicas' => 0.1,
            ],
            'cafeteira elétrica' => [
                'thresholds' => ['A+' => 600, 'A' => 800, 'B' => 1000, 'C' => 1200, 'D' => 1500],
                'horas_tipicas' => 0.25,
            ],
            'chuveiro elétrico', 'chuveiro', 'aquecedor' => [
                'thresholds' => ['A+' => 3500, 'A' => 4500, 'B' => 5500, 'C' => 6500, 'D' => 7500],
                'horas_tipicas' => 0.33,
            ],
            'computador', 'notebook' => [
                'thresholds' => ['A+' => 50, 'A' => 100, 'B' => 200, 'C' => 350, 'D' => 500],
                'horas_tipicas' => 6.0,
            ],
            'ventilador' => [
                'thresholds' => ['A+' => 40, 'A' => 60, 'B' => 80, 'C' => 120, 'D' => 160],
                'horas_tipicas' => 8.0,
            ],
            // Valor padrão para categorias desconhecidas (Outros)
            default => [
                'thresholds' => ['A+' => 100, 'A' => 200, 'B' => 400, 'C' => 700, 'D' => 1000],
                'horas_tipicas' => 2.0,
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
     * @param bool $forceRecalculate Force recalculation even if value exists
     */
    public function calcularConsumoKwhMes(Eletro $eletro, bool $forceRecalculate = false): float
    {
        if (!$forceRecalculate && !is_null($eletro->eletro_mensal_kwh)) {
            return round($eletro->eletro_mensal_kwh, 2);
        }
        
        return round($this->calcularConsumoKwhDia($eletro) * 30, 2);
    }
    
    /**
     * Calculate annual energy consumption in kWh
     * @param bool $forceRecalculate Force recalculation even if value exists
     */
    public function calcularConsumoKwhAno(Eletro $eletro, bool $forceRecalculate = false): float
    {
        if (!$forceRecalculate && !is_null($eletro->eletro_anual_kwh)) {
            return round($eletro->eletro_anual_kwh, 2);
        }
        
        return round($this->calcularConsumoKwhDia($eletro) * 365, 2);
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
     * @param bool $forceRecalculate Force recalculation even if value exists
     */
    public function calcularEmissaoCO2Anual(Eletro $eletro, bool $forceRecalculate = false): float
    {
        if (!$forceRecalculate && !is_null($eletro->eletro_emissao_co2_anual)) {
            return round($eletro->eletro_emissao_co2_anual, 2);
        }
        
        $fatorEmissao = 0.0817; // kg CO2/kWh
        
        $consumoAnual = $this->calcularConsumoKwhDia($eletro) * 365;
        
        return round($consumoAnual * $fatorEmissao, 2);
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