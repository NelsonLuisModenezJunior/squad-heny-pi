<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Categoria extends Model
{
    use HasFactory;

    protected $table = 'comodo_eletros';
    protected $primaryKey = 'comodo_id';

    protected $fillable = [
        'comodo_nome',
    ];

    public function eletros(): HasMany
    {
        return $this->hasMany(Eletro::class, 'comodo_id', 'comodo_id');
    }
}
