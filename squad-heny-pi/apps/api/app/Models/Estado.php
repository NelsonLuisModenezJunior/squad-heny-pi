<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Estado extends Model
{
    protected $fillable = [
        'estado_nome',
        'estado_uf'
    ];

    public function locais()
    {
        return $this->hasMany(Local::class);
    }
}