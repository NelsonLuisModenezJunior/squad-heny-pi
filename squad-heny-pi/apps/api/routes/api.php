<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\EletroController;

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

    // Rota para obter as classificações de eficiência do eletrodoméstico
    Route::get('/classificacoes', function() {
        return response()->json(Eletro::CLASSIFICACOES);
    });
    
    // Rota original (com JWT ao invés de sanctum)
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});