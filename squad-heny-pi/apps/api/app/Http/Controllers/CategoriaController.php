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

    public function show(string $id): JsonResponse
    {
        $categoria = Categoria::with('eletros')->findOrFail($id);
        return response()->json($categoria);
    }

}