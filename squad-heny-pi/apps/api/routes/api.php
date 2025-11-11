<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\EletroController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\EstadoController;
use App\Http\Controllers\LocalController;
use App\Http\Controllers\ComodoController;
use App\Http\Controllers\CategoriaController;

// Rotas Públicas (sem autenticação)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Rotas Protegidas (autenticação JWT necessária)
Route::middleware('auth:api')->group(function () {
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/refresh', [AuthController::class, 'refresh']);

    // CRUD usuários
    Route::apiResource('users', UserController::class);

    // CRUD eletrodomésticos
    Route::apiResource('eletros', EletroController::class);
    
    // rotas comodos
    Route::apiResource('comodos', ComodoController::class)-> only(['index', 'show']);

    //rotas categorias
    Route::apiResource('categorias', CategoriaController::class)-> only(['index', 'show']);

    // Rota para obter as classificações de eficiência do eletrodoméstico
    Route::get('/classificacoes', function() {
        return response()->json(Eletro::CLASSIFICACOES);
    });

    // Rotas para estados
    Route::apiResource('estados', EstadoController::class)->only(['index', 'show']);

    // Rotas para locais
    Route::apiResource('locais', LocalController::class);
    
    // Rotas de relatórios
    Route::get('/reports/consumption/{locationId}', [ReportController::class, 'getConsumption']);
    
    // Rota original (com JWT ao invés de sanctum)
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});