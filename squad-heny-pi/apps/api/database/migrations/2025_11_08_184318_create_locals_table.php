<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('locals', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('local_nome', 255);
            $table->string('local_cidade', 255);
            $table->string('local_endereco', 255);
            $table->string('local_numero', 7);
            $table->foreignId('estado_id')->constrained('estados');
            $table->unsignedBigInteger('tarifa_id');
            $table->foreign('tarifa_id')->references('tarifa_id')->on('tarifas')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('locals');
    }
};
