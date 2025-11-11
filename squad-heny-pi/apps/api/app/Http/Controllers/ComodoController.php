<?php
namespace App\Http\Controllers;

use App\Models\Comodo;
use Illuminate\Http\JsonResponse;

class ComodoController extends Controller
{
    //listar todos os cômodos
    public function index(): JsonResponse
    {
        $comodos = Comodo::all();
        return response()->json($comodos);
    }

    //mostrar um cômodo específico
    public function show(string $id): JsonResponse
    {
        $comodo = Comodo::with('eletros')->findOrFail($id);
        return response()->json($comodo);
    }
}