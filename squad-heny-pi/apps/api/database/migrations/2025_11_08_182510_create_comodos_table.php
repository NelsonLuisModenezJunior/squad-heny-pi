<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('comodo_eletros', function (Blueprint $table) {
            $table->id('comodo_id');
            $table->string('comodo_nome', 255);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('comodo_eletros');
}
}; 