<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Local extends Model
{
    /** @use HasFactory<\Database\Factories\LocalFactory> */
    use HasFactory;

    protected $table = 'locals';

    protected $fillable = [
        'user_id',
        'local_nome',
        'local_cidade',
        'local_endereco',
        'local_numero',
        'estado_id',
        'tarifa_id'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function eletros()
    {
        return $this->hasMany(Eletro::class);
    }

    public function estado()
    {
        return $this->belongsTo(Estado::class);
    }

    public function tarifa()
    {
        return $this->belongsTo(Tarifa::class, 'tarifa_id', 'tarifa_id');
    }
}
