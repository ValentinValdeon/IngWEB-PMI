<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\CategoriaOpcion;
use App\Models\Categoria;

class CategoriaOpcionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Buscar cada categoria para usarla
        $genero = Categoria::where('nombre', 'Genero')->first();
        $forma = Categoria::where('nombre', 'Forma')->first();
        $edad = Categoria::where('nombre', 'Edad')->first();
        $tipoUso = Categoria::where('nombre', 'Tipo de uso')->first();


        CategoriaOpcion::create([
            'categoria_id' => $genero->id,
            'nombre' => 'Masculino'
        ]);

        CategoriaOpcion::create([
            'categoria_id' => $genero->id,
            'nombre' => 'Femenino'
        ]);

        CategoriaOpcion::create([
            'categoria_id' => $forma->id,
            'nombre' => 'Redondo'
        ]);

        CategoriaOpcion::create([
            'categoria_id' => $forma->id,
            'nombre' => 'Cuadrado'
        ]);

        CategoriaOpcion::create([
            'categoria_id' => $forma->id,
            'nombre' => 'Rectangular'
        ]);

        CategoriaOpcion::create([
            'categoria_id' => $edad->id,
            'nombre' => 'Niño'
        ]);

        CategoriaOpcion::create([
            'categoria_id' => $edad->id,
            'nombre' => 'Adolcente'
        ]);

        CategoriaOpcion::create([
            'categoria_id' => $edad->id,
            'nombre' => 'Adulto'
        ]);

        CategoriaOpcion::create([
            'categoria_id' => $tipoUso->id,
            'nombre' => 'Urbano'
        ]);

        CategoriaOpcion::create([
            'categoria_id' => $tipoUso->id,
            'nombre' => 'Escolar'
        ]);

        CategoriaOpcion::create([
            'categoria_id' => $tipoUso->id,
            'nombre' => 'Viajera'
        ]);
    }
}
