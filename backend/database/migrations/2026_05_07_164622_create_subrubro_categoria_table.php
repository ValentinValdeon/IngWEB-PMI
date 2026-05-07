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
        Schema::create('subrubro_categoria', function (Blueprint $table) {

            $table->id();

            $table->foreignId('subrubro_id')
                  ->constrained('subrubros')
                  ->cascadeOnDelete();

            $table->foreignId('categoria_id')
                  ->constrained('categorias')
                  ->cascadeOnDelete();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subrubro_categoria');
    }
};