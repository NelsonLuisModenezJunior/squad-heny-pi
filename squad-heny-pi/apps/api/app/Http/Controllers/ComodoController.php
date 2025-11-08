<?php

namespace App\Http\Controllers;

use App\Models\Comodo;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ComodoController extends Controller
{
    public function index(): JsonResponse
    {
        $comodos = Comodo::with('eletros')->get();
        return response()->json($comodos);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'comodo_nome' => 'required|string|max:255',
        ]);

        $comodo = Comodo::create($validated);
        return response()->json($comodo, 201);
    }

    public function show(string $id): JsonResponse
    {
        $comodo = Comodo::with('eletros')->findOrFail($id);
        return response()->json($comodo);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $comodo = Comodo::findOrFail($id);

        $validated = $request->validate([
            'comodo_nome' => 'sometimes|required|string|max:255',
        ]);

        $categoria->update($validated);
        return response()->json($categoria);
    }

    public function destroy(string $id): JsonResponse
    {
        $categoria = Categoria::findOrFail($id);
        $categoria->delete();
        return response()->json(null, 204);
    }
}