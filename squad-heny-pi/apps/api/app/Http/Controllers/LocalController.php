<?php

namespace App\Http\Controllers;

use App\Models\Local;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class LocalController extends Controller
{
    public function index()
    {
        // Retorna apenas locais do usuário autenticado
        $locals = auth()->user()->locals()
                       ->with(['eletros', 'estado', 'tarifa'])
                       ->get();
        return response()->json($locals);
    }

    public function store(Request $request)
    {
        \Log::info('=== STORE LOCAL CHAMADO ===');
        \Log::info('Request data:', $request->all());
        
        try {
            $validated = $request->validate([
                'local_nome' => 'required|string|max:255',
                'local_cidade' => 'required|string|max:255',
                'local_endereco' => 'required|string|max:255',
                'local_numero' => 'required|string|max:7',
                'estado_id' => 'required|exists:estados,id',
                'tarifa_id' => 'required|exists:tarifas,tarifa_id'
            ]);
            
            // pega o user_id do usuário autenticado
            $validated['user_id'] = auth()->id();
            
            \Log::info('Dados validados:', $validated);

            $local = Local::create($validated);
            
            \Log::info('Local criado:', $local->toArray());
            
            return response()->json($local->load(['estado', 'tarifa']), Response::HTTP_CREATED);
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Erro de validação:', $e->errors());
            throw $e;
        } catch (\Exception $e) {
            \Log::error('Erro ao criar local:', ['message' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            throw $e;
        }
    }

    public function show($id)
    {
        $local = Local::with(['eletros', 'estado', 'tarifa'])->findOrFail($id);
        
        // Verifica se o local pertence ao usuário autenticado
        if ($local->user_id !== auth()->id()) {
            return response()->json(['error' => 'Não autorizado'], Response::HTTP_FORBIDDEN);
        }
        
        return response()->json($local);
    }

    public function update(Request $request, $id)
    {
        $local = Local::findOrFail($id);
        
        // Verifica se o local pertence ao usuário autenticado
        if ($local->user_id !== auth()->id()) {
            return response()->json(['error' => 'Não autorizado'], Response::HTTP_FORBIDDEN);
        }
        
        $request->validate([
            'local_nome' => 'string|max:255',
            'local_cidade' => 'string|max:255',
            'local_endereco' => 'string|max:255',
            'local_numero' => 'string|max:7',
            'estado_id' => 'exists:estados,id',
            'tarifa_id' => 'exists:tarifas,tarifa_id'
        ]);

        $local->update($request->all());
        return response()->json($local);
    }

    public function destroy($id)
    {
        \Log::info('=== DESTROY LOCAL CHAMADO ===');
        \Log::info('ID recebido:', ['id' => $id]);
        
        try {
            $local = Local::findOrFail($id);
            \Log::info('Local encontrado:', $local->toArray());
            
            // Verifica se o local pertence ao usuário autenticado
            if ($local->user_id !== auth()->id()) {
                \Log::warning('Tentativa de deletar local de outro usuário', [
                    'local_user_id' => $local->user_id,
                    'auth_user_id' => auth()->id()
                ]);
                return response()->json(['error' => 'Não autorizado'], Response::HTTP_FORBIDDEN);
            }
            
            $local->delete();
            \Log::info('Local deletado com sucesso');
            return response()->json(null, Response::HTTP_NO_CONTENT);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            \Log::error('Local não encontrado:', ['id' => $id]);
            return response()->json(['error' => 'Local não encontrado'], Response::HTTP_NOT_FOUND);
        } catch (\Exception $e) {
            \Log::error('Erro ao deletar local:', ['message' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            throw $e;
        }
    }
}
