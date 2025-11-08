<?php

namespace App\Http\Controllers;

use App\Models\Estado;
use Illuminate\Http\Request;

class EstadoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Estado::all());
    }

    /**
     * Display the specified resource.
     */
    public function show(Estado $estado)
    {
        return response()->json($estado);
    }
}
