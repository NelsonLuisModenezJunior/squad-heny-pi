<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('eletrodomesticos', function (Blueprint $table) {
            $table->id('eletro_id');
            $table->unsignedBigInteger('categoria_id');
            $table->unsignedBigInteger('comodo_id');
            $table->string('eletro_nome', 255);
            $table->decimal('eletro_potencia', 6, 2);
            $table->timestamps();
            $table->decimal('eletro_hrs_uso_dia', 5, 2);
            $table->decimal('eletro_mensal_kwh', 8, 2)->nullable();
            $table->decimal('eletro_anual_kwh', 8, 2)->nullable();
            $table->decimal('eletro_custo_mensal', 8, 2)->nullable();
            $table->decimal('eletro_custo_anual', 8, 2)->nullable();
            $table->decimal('eletro_emissao_co2_anual', 8, 2)->nullable();

            $table->foreign('categoria_id')
                  ->references('categoria_id')
                  ->on('categoria_eletros')
                  ->onDelete('cascade');

            $table->foreign('comodo_id')
                  ->references('comodo_id')
                  ->on('comodo_eletros')
                  ->onDelete('cascade');

            $table->foreignId('local_id')
            ->constrained('locals')
            ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('eletrodomesticos');
    }
};