<?php

namespace App\Http\Controllers;

use App\Models\Tarifa;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class TarifaController extends Controller
{
    public function index()
    {
        $tarifas = Tarifa::all();
        return response()->json($tarifas);
    }

    public function store(Request $request)
    {
        $request->validate([
            'tarifa_valor' => 'required|numeric|min:0|max:999.9999'
        ]);

        $tarifa = Tarifa::create($request->all());
        return response()->json($tarifa, Response::HTTP_CREATED);
    }

    public function show(Tarifa $tarifa)
    {
        return response()->json($tarifa);
    }

    public function update(Request $request, Tarifa $tarifa)
    {
        $request->validate([
            'tarifa_valor' => 'numeric|min:0|max:999.9999'
        ]);

        $tarifa->update($request->all());
        return response()->json($tarifa);
    }

    public function destroy(Tarifa $tarifa)
    {
        $tarifa->delete();
        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}
