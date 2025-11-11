<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Local extends Model
{
    /** @use HasFactory<\Database\Factories\LocalFactory> */
    use HasFactory;

    protected $fillable = [
        'local_nome',
        'local_cidade',
        'local_endereco',
        'local_numero',
        'local_desc',
        'estado_id'
    ];

    public function eletros()
    {
        return $this->hasMany(Eletro::class);
    }

    public function estado()
    {
        return $this->belongsTo(Estado::class);
    }
}
