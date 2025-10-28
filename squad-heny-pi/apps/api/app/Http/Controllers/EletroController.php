<?php

namespace App\Http\Controllers;

use App\Models\Eletro;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class EletroController extends Controller
{
    public function index(): JsonResponse
    {
        $eletros = Eletro::with('categoria')->get();
        return response()->json($eletros);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'categoria_id' => 'required|exists:categoria_eletros,categoria_id',
            'eletro_nome' => 'required|string|max:255',
            'eletro_emissao' => 'required|numeric|min:0|max:9999.99',
            'eletro_potencia' => 'required|numeric|min:0|max:9999.99',
            'eletro_dt_criado' => 'required|date',
            'eletro_hrs_uso_dia' => 'required|integer|min:0|max:24',
            'eletro_mensal_kwh' => 'required|numeric|min:0|max:9999.99',
            'eletro_anual_kwh' => 'required|numeric|min:0|max:9999.99',
            'eletro_custo_mensal' => 'required|numeric|min:0|max:9999.99',
            'eletro_custo_anual' => 'required|numeric|min:0|max:9999.99',
            'eletro_emissao_co2_anual' => 'required|numeric|min:0|max:9999.99',
        ]);

        $eletro = Eletro::create($validated);
        return response()->json($eletro->load('categoria'), 201);
    }

    public function show(string $id): JsonResponse
    {
        $eletro = Eletro::with('categoria')->findOrFail($id);
        return response()->json($eletro);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $eletro = Eletro::findOrFail($id);

        $validated = $request->validate([
            'categoria_id' => 'sometimes|required|exists:categoria_eletros,categoria_id',
            'eletro_nome' => 'sometimes|required|string|max:255',
            'eletro_emissao' => 'sometimes|required|numeric|min:0|max:9999.99',
            'eletro_potencia' => 'sometimes|required|numeric|min:0|max:9999.99',
            'eletro_dt_criado' => 'sometimes|required|date',
            'eletro_hrs_uso_dia' => 'sometimes|required|integer|min:0|max:24',
            'eletro_mensal_kwh' => 'sometimes|required|numeric|min:0|max:9999.99',
            'eletro_anual_kwh' => 'sometimes|required|numeric|min:0|max:9999.99',
            'eletro_custo_mensal' => 'sometimes|required|numeric|min:0|max:9999.99',
            'eletro_custo_anual' => 'sometimes|required|numeric|min:0|max:9999.99',
            'eletro_emissao_co2_anual' => 'sometimes|required|numeric|min:0|max:9999.99',
        ]);

        $eletro->update($validated);
        return response()->json($eletro->load('categoria'));
    }

    public function destroy(string $id): JsonResponse
    {
        $eletro = Eletro::findOrFail($id);
        $eletro->delete();
        return response()->json(null, 204);
    }
}