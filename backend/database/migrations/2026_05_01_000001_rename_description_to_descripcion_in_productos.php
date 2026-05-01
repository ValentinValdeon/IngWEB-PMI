<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// TEMPORAL: esta migración corrige el nombre de la columna 'description' (inglés)
// a 'descripcion' (español) para que coincida con el modelo y el formulario.
// La migración original (2026_04_23_010659_create_productos_table.php) no se tocó
// para no romper el trabajo de los demás integrantes del equipo.
return new class extends Migration {
    public function up(): void
    {
        Schema::table('productos', function (Blueprint $table) {
            $table->renameColumn('description', 'descripcion');
        });
    }

    public function down(): void
    {
        Schema::table('productos', function (Blueprint $table) {
            $table->renameColumn('descripcion', 'description');
        });
    }
};
