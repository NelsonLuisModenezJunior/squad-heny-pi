<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HistoricoConsumoMensal extends Model
{
    use HasFactory;

    protected $table = 'historico_consumo_mensal';
    protected $primaryKey = 'historico_id';

    protected $fillable = [
        'local_id',
        'mes',
        'ano',
        'consumo_total',
        'custo_total',
        'emissao_co2',
    ];

    protected $casts = [
        'mes' => 'integer',
        'ano' => 'integer',
        'consumo_total' => 'decimal:2',
        'custo_total' => 'decimal:2',
        'emissao_co2' => 'decimal:2',
    ];

    public function local()
    {
        return $this->belongsTo(Local::class, 'local_id', 'id');
    }
}
