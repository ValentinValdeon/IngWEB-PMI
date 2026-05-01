<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

// Seeder de prueba: carga datos mínimos para poder probar el formulario de productos.
// Inserta solo si la tabla está vacía para no duplicar datos.
class RubroSeeder extends Seeder
{
    public function run(): void
    {
        if (DB::table('rubros')->count() > 0) {
            return; // ya hay datos, no hacer nada
        }

        $rubroId = DB::table('rubros')->insertGetId([
            'nombre'     => 'Electrónica',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('subrubros')->insert([
            [
                'nombre'     => 'Celulares',
                'rubro_id'   => $rubroId,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nombre'     => 'Computadoras',
                'rubro_id'   => $rubroId,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
