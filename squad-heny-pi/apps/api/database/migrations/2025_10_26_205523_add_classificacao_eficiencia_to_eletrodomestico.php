<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('eletrodomestico', function (Blueprint $table) {
            $table->enum('classificacao_eficiencia', ['A+', 'A', 'B', 'C', 'D', 'E'])
                  ->nullable()
                  ->after('eletro_potencia');
        });
    }

    public function down(): void
    {
        Schema::table('eletrodomestico', function (Blueprint $table) {
            $table->dropColumn('classificacao_eficiencia');
        });
    }
};