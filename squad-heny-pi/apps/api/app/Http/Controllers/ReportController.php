<?php

namespace App\Http\Controllers;

use App\Models\Local;
use App\Models\Eletro;
use App\Services\EficienciaService;
use Illuminate\Http\JsonResponse;

class ReportController extends Controller
{
    public function __construct(
        private EficienciaService $eficienciaService
    ) {}

    public function getConsumption(string $locationId): JsonResponse
    {
        // Find location and eager load appliances and comodos
        $location = Local::with(['eletros', 'eletros.comodo'])->findOrFail($locationId);
        $eletros = $location->eletros;

        return response()->json([
            'monthlyConsumption' => $this->eficienciaService->calcularConsumoTotalMes($eletros),
            'monthlyCost' => $this->eficienciaService->calcularCustoTotalMes($eletros, $location->tariff),
            'efficiencyRate' => $this->eficienciaService->calcularTaxaEficiencia($eletros),
            'consumptionByRoom' => $this->eficienciaService->getConsumoPorComodo($eletros),
            'efficiencyDistribution' => $this->eficienciaService->getDistribuicaoEficiencia($eletros),
            'annualCO2Emissions' => $this->eficienciaService->calcularEmissaoCO2Total($eletros),
        ]);
    }
}