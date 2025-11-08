<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Eletro extends Model
{
    use HasFactory;

    /**
     * Table name in database
     */
    protected $table = 'eletrodomestico';

    /**
     * Primary key column
     */
    protected $primaryKey = 'eletro_id';

    /**
     * Fields that can be mass assigned
     */
    protected $fillable = [
        'categoria_id',
        'local_id',
        'eletro_nome',
        'eletro_emissao',
        'eletro_potencia',
        'eletro_hrs_uso_dia',
        'eletro_mensal_kwh',
        'eletro_anual_kwh',
        'eletro_custo_mensal',
        'eletro_custo_anual',
        'eletro_emissao_co2_anual',
        'classificacao_eficiencia',
    ];

    /**
     * Type casting for attributes
     */
    protected $casts = [
        'eletro_emissao' => 'decimal:2',
        'eletro_potencia' => 'decimal:2',
        'eletro_dt_criado' => 'datetime',
        'eletro_mensal_kwh' => 'decimal:2',
        'eletro_anual_kwh' => 'decimal:2',
        'eletro_custo_mensal' => 'decimal:2',
        'eletro_custo_anual' => 'decimal:2',
        'eletro_emissao_co2_anual' => 'decimal:2',
        'eletro_hrs_uso_dia' => 'decimal:2',
    ];

    /**
     * Disable automatic timestamps
     */
    public $timestamps = false;

    const CREATED_AT = 'eletro_dt_criado';

    public const CLASSIFICACOES = ['A+', 'A', 'B', 'C', 'D', 'E'];

    protected static function boot()
    {
        //checagem do payload do frontend para calcular a classificacao de eficiencia
        parent::boot();
        static::saving(function ($eletro) {
            if ($eletro->classificacao_eficiencia === null || $eletro->classificacao_eficiencia === '') {
                $service = app(EficienciaService::class);
                $eletro->classificacao_eficiencia = $service->calcularClassificacao($eletro);
            }
        });
    }


    public function categoria()
    {
        return $this->belongsTo(Categoria::class, 'categoria_id', 'categoria_id');
    }

    public function local()
    {
        return $this->belongsTo(Local::class, 'local_id');
    }
}