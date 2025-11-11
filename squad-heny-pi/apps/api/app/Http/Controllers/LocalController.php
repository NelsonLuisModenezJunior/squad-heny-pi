<?php

namespace App\Http\Controllers;

use App\Models\Local;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class LocalController extends Controller
{
    public function index()
    {
        $locals = Local::with(['eletros', 'estado'])->get();
        return response()->json($locals);
    }

    public function store(Request $request)
    {
        $request->validate([
            'local_nome' => 'required|string|max:255',
            'local_cidade' => 'required|string|max:255',
            'local_endereco' => 'required|string|max:255',
            'local_numero' => 'required|string|max:7',
            'local_desc' => 'required|string|max:255',
            'estado_id' => 'required|exists:estados,id'
        ]);

        $local = Local::create($request->all());
        return response()->json($local, Response::HTTP_CREATED);
    }

    public function show(Local $local)
    {
        return response()->json($local->load(['eletros', 'estado']));
    }

    public function update(Request $request, Local $local)
    {
        $request->validate([
            'local_nome' => 'string|max:255',
            'local_cidade' => 'string|max:255',
            'local_endereco' => 'string|max:255',
            'local_numero' => 'string|max:7',
            'local_desc' => 'string|max:255',
            'estado_id' => 'exists:estados,id'
        ]);

        $local->update($request->all());
        return response()->json($local);
    }

    public function destroy(Local $local)
    {
        $local->delete();
        return response()->json(null, Response::HTTP_NO_CONTENT);
    }
}
