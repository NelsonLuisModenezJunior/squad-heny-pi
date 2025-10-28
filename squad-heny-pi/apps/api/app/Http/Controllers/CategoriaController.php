<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CategoriaController extends Controller
{
    public function index(): JsonResponse
    {
        $categorias = Categoria::with('eletros')->get();
        return response()->json($categorias);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'categoria_nome' => 'required|string|max:255',
        ]);

        $categoria = Categoria::create($validated);
        return response()->json($categoria, 201);
    }

    public function show(string $id): JsonResponse
    {
        $categoria = Categoria::with('eletros')->findOrFail($id);
        return response()->json($categoria);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $categoria = Categoria::findOrFail($id);

        $validated = $request->validate([
            'categoria_nome' => 'sometimes|required|string|max:100',
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