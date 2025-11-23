<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::create('historico_consumo_mensal', function (Blueprint $table) {
            $table->id('historico_id');
            $table->unsignedBigInteger('local_id');
            $table->tinyInteger('mes');
            $table->year('ano');
            $table->decimal('consumo_total', 10, 2); // kWh
            $table->decimal('custo_total', 10, 2); // R$
            $table->decimal('emissao_co2', 10, 2)->nullable(); // kg CO2
            $table->timestamps();

            
            $table->foreign('local_id')
                ->references('id')
                ->on('locals')
                ->onDelete('cascade');

            // Evita duplicatas
            $table->unique(['local_id', 'mes', 'ano']);
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('historico_consumo_mensal');
    }
};
