<?php
# php artisan make:model Producto -s
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('productos', function (Blueprint $table) {
            $table->id();

            $table->foreignId('rubro_id')->constrained()->onDelete('cascade');
            $table->foreignId('subrubro_id')->constrained()->onDelete('cascade');

            $table->string('titulo');
            $table->text('description')->nullable();
            $table->decimal('precio', 10, 2);
            $table->string('ruta_imagen')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('productos');
    }
};
