<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Categoria extends Model
{
    use HasFactory;

    protected $table = 'categoria_eletros';
    protected $primaryKey = 'categoria_id';

    protected $fillable = [
        'categoria_nome',
    ];

    public function eletros(): HasMany
    {
        return $this->hasMany(Eletro::class, 'categoria_id', 'categoria_id');
    }
}
