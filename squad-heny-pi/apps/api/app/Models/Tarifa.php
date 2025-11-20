<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tarifa extends Model
{
    /** @use HasFactory<\Database\Factories\TarifaFactory> */
    use HasFactory;

    protected $primaryKey = 'tarifa_id';

    protected $fillable = [
        'tarifa_valor'
    ];

    public function locals()
    {
        return $this->hasMany(Local::class, 'tarifa_id', 'tarifa_id');
    }
}
