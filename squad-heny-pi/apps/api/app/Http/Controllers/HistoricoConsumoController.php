<?php

namespace App\Http\Controllers;

use App\Services\HistoricoConsumoService;
use Illuminate\Http\Request;

class HistoricoConsumoController extends Controller
{
    private HistoricoConsumoService $historicoService;

    public function __construct(HistoricoConsumoService $historicoService)
    {
        $this->historicoService = $historicoService;
    }

    /**
     * Retorna o histórico mensal de consumo de um local
     * GET /api/locais/{id}/historico-mensal
     */
    public function getHistoricoLocal(int $localId)
    {
        try {
            $historico = $this->historicoService->getHistoricoCompleto($localId, 6);

            return response()->json($historico, 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro ao buscar histórico de consumo',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Consolida manualmente o histórico de um local
     * POST /api/locais/{id}/consolidar-historico
     */
    public function consolidarHistorico(int $localId)
    {
        try {
            $mesesConsolidados = $this->historicoService->consolidarMesesPendentes($localId);

            return response()->json([
                'message' => 'Histórico consolidado com sucesso',
                'meses_consolidados' => $mesesConsolidados
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro ao consolidar histórico',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
