<?php

namespace App\Http\Controllers;

use App\Models\Eletro;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class EletroController extends Controller
{
    public function index(): JsonResponse
    {
        // Retorna apenas eletros dos locais do usuário autenticado
        $eletros = Eletro::with(['categoria', 'comodo', 'local.tarifa'])
                         ->whereHas('local', function($query) {
                             $query->where('user_id', auth()->id());
                         })
                         ->get();
        return response()->json($eletros);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'categoria_id' => 'required|exists:categoria_eletros,categoria_id',
            'comodo_id' => 'required|exists:comodo_eletros,comodo_id',
            'local_id' => 'required|exists:locals,id',
            'eletro_nome' => 'required|string|max:255',
            'eletro_potencia' => 'required|numeric|min:0|max:9999.99',
            'eletro_hrs_uso_dia' => 'required|numeric|min:0|max:24',
            'eletro_mensal_kwh' => 'nullable|numeric|min:0|max:999999.99',
            'eletro_anual_kwh' => 'nullable|numeric|min:0|max:999999.99',
            'eletro_custo_mensal' => 'nullable|numeric|min:0|max:999999.99',
            'eletro_custo_anual' => 'nullable|numeric|min:0|max:999999.99',
            'eletro_emissao_co2_anual' => 'nullable|numeric|min:0|max:999999.99',
        ]);

        // Verifica se o local pertence ao usuário autenticado
        $local = \App\Models\Local::where('id', $validated['local_id'])
                                  ->where('user_id', auth()->id())
                                  ->first();
        
        if (!$local) {
            return response()->json(['error' => 'Local não encontrado ou não pertence ao usuário'], 403);
        }

        $eletro = Eletro::create($validated);
        
        // Recarregar do banco com todos os valores calculados e relações
        $eletro = Eletro::with(['categoria', 'comodo', 'local.tarifa'])->find($eletro->eletro_id);
        
        return response()->json($eletro, 201);
    }

    public function show(string $id): JsonResponse
    {
        $eletro = Eletro::with(['categoria', 'comodo', 'local.tarifa'])->findOrFail($id);
        
        // Verifica se o eletro pertence a um local do usuário autenticado
        if ($eletro->local->user_id !== auth()->id()) {
            return response()->json(['error' => 'Não autorizado'], 403);
        }
        
        return response()->json($eletro);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $eletro = Eletro::findOrFail($id);
        
        // Verifica se o eletro pertence a um local do usuário autenticado
        if ($eletro->local->user_id !== auth()->id()) {
            return response()->json(['error' => 'Não autorizado'], 403);
        }

        $validated = $request->validate([
            'categoria_id' => 'sometimes|required|exists:categoria_eletros,categoria_id',
            'comodo_id' => 'sometimes|required|exists:comodo_eletros,comodo_id',
            'local_id' => 'sometimes|nullable|exists:locals,id',
            'eletro_nome' => 'sometimes|required|string|max:255',
            'eletro_potencia' => 'sometimes|required|numeric|min:0|max:9999.99',
            'eletro_hrs_uso_dia' => 'sometimes|required|numeric|min:0|max:24',
            'eletro_mensal_kwh' => 'sometimes|required|numeric|min:0|max:999999.99',
            'eletro_anual_kwh' => 'sometimes|required|numeric|min:0|max:999999.99',
            'eletro_custo_mensal' => 'sometimes|required|numeric|min:0|max:999999.99',
            'eletro_custo_anual' => 'sometimes|required|numeric|min:0|max:999999.99',
            'eletro_emissao_co2_anual' => 'sometimes|required|numeric|min:0|max:999999.99',
        ]);
        
        // Se está tentando mudar de local, verifica se o novo local pertence ao usuário
        if (isset($validated['local_id']) && $validated['local_id'] !== $eletro->local_id) {
            $novoLocal = \App\Models\Local::where('id', $validated['local_id'])
                                          ->where('user_id', auth()->id())
                                          ->first();
            
            if (!$novoLocal) {
                return response()->json(['error' => 'Novo local não encontrado ou não pertence ao usuário'], 403);
            }
        }

        $eletro->update($validated);
        return response()->json($eletro->load(['categoria', 'comodo', 'local.tarifa']));
    }

    public function destroy(string $id): JsonResponse
    {
        $eletro = Eletro::findOrFail($id);
        
        // Verifica se o eletro pertence a um local do usuário autenticado
        if ($eletro->local->user_id !== auth()->id()) {
            return response()->json(['error' => 'Não autorizado'], 403);
        }
        
        $eletro->delete();
        return response()->json(null, 204);
    }
}