<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RubroSeeder extends Seeder
{
    public function run(): void
    {
        // Limpiar para poder re-seedear sin duplicados
        DB::table('subrubros')->delete();
        DB::table('rubros')->delete();

        $rubros = [
            'Marroquinería' => [
                'Carteras',
                'Billeteras',
                'Mochilas',
                'Cinturones',
                'Calzado',
                'Bolsos',
            ],
            'Vitrofusión' => [
                'Bazar - Platos',
                'Bazar - Bandejas',
                'Bazar - Fuentes',
                'Bazar - Pizzeras',
                'Bazar - Paneras',
                'Decoración',
            ],
            'Textil' => [
                'Indumentaria Fiesta',
                'Indumentaria Urbana',
                'Indumentaria Deportiva',
                'Línea Femenino',
                'Línea Masculino',
            ],
            'Carpintería' => [
                'Tallado',
                'Grabado',
                'Mobiliario',
            ],
        ];

        foreach ($rubros as $nombreRubro => $subrubros) {
            $rubroId = DB::table('rubros')->insertGetId([
                'nombre'     => $nombreRubro,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            foreach ($subrubros as $nombreSubrubro) {
                DB::table('subrubros')->insert([
                    'nombre'     => $nombreSubrubro,
                    'rubro_id'   => $rubroId,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
