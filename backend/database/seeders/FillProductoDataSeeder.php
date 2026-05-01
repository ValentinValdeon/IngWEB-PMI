<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FillProductoDataSeeder extends Seeder
{
    /**
     * Completa descripcion y precio de los productos que los tienen en NULL.
     * Identifica cada producto por su ID para mayor precisión.
     */
    public function run(): void
    {
        $datos = [
            // ── MARROQUINERÍA ──────────────────────────────────────────────
            4  => [
                'descripcion' => 'Mochila de cuero vacuno de primera calidad. Compartimento principal amplio, bolsillo frontal con cierre y correas acolchadas regulables. 35 × 42 × 15 cm.',
                'precio'      => 65000.00,
            ],
            5  => [
                'descripcion' => 'Cartera de lujo en cuero plena flor con herrajes dorados. Interior forrado en gamuza. Cierre magnético. 30 × 22 × 10 cm.',
                'precio'      => 85000.00,
            ],
            6  => [
                'descripcion' => 'Zapatillas urbanas de cuero con suela de goma antideslizante. Diseño clásico con costura reforzada. Disponible en negro y blanco. Tallas 36–45.',
                'precio'      => 52000.00,
            ],
            8  => [
                'descripcion' => 'Bolso de cuero artesanal con asas de metal y cierre con cremallera. Interior con bolsillo organizador. 40 × 28 × 12 cm.',
                'precio'      => 78000.00,
            ],
            9  => [
                'descripcion' => 'Bolso resistente para actividades al aire libre. Cuero tratado impermeable, correa ajustable, múltiples compartimentos. 50 × 35 × 20 cm.',
                'precio'      => 92000.00,
            ],
            10 => [
                'descripcion' => 'Billetera slim en cuero refinado con acabado brillante. 6 ranuras para tarjetas, porta documentos y billetero central. 20 × 10 cm.',
                'precio'      => 22500.00,
            ],
            11 => [
                'descripcion' => 'Billetera compacta en cuero curtido color café. 4 tarjeteras, bolsillo trasero con cierre. Costura a mano en hilo tono a tono.',
                'precio'      => 18000.00,
            ],
            12 => [
                'descripcion' => 'Cinturón de PU de alta resistencia con hebilla plateada. Ancho 3.5 cm. Tallas 80 a 130 cm. Ideal uso diario.',
                'precio'      => 9500.00,
            ],
            13 => [
                'descripcion' => 'Cinturón de cuero vacuno curtido con hebilla de hierro. Acabado natural. Ancho 3 cm. Tallas 90 a 120 cm.',
                'precio'      => 16800.00,
            ],
            14 => [
                'descripcion' => 'Zapatillas urbanas de cuero con diseño moderno y suela EVA flexible. Ligeras y cómodas. Disponibles en 3 colores. Tallas 36–44.',
                'precio'      => 48000.00,
            ],
            15 => [
                'descripcion' => 'Cartera de cuero artesanal con cierre metálico y asa de cadena dorada. Forrado interior con tela satinada. 26 × 18 × 8 cm.',
                'precio'      => 55000.00,
            ],
            16 => [
                'descripcion' => 'Zapatos de cuero de alta gama con plantilla acolchada y suela de cuero cosida. Diseño elegante para ocasiones especiales. Tallas 36–45.',
                'precio'      => 74000.00,
            ],
            41 => [
                'descripcion' => 'Bolso moderno en cuero sintético premium con asa corta y bandolera regulable. Interior con bolsillos organizadores. 32 × 25 × 10 cm.',
                'precio'      => 42000.00,
            ],
            42 => [
                'descripcion' => 'Cartera estilo Gucci en cuero genuino con logo grabado. Herrajes dorados y forro interior de seda. 28 × 20 × 7 cm.',
                'precio'      => 110000.00,
            ],

            // ── VITROFUSIÓN ────────────────────────────────────────────────
            17 => [
                'descripcion' => 'Set de 2 pizzeras de metal reforzado con recubrimiento antiadherente. Diámetro 34 cm. Apta para horno hasta 250 °C.',
                'precio'      => 18500.00,
            ],
            18 => [
                'descripcion' => 'Pizzera individual en madera de bambú con borde calado decorativo. Diámetro 32 cm. Apta para servir, no para horno.',
                'precio'      => 9800.00,
            ],
            19 => [
                'descripcion' => 'Bandeja cuadrada artesanal en madera de pino alistonado. Bordes redondeados y terminación al aceite. 35 × 35 × 4 cm.',
                'precio'      => 13500.00,
            ],
            20 => [
                'descripcion' => 'Bandeja cuadrada en madera de roble macizo con incrustaciones decorativas. Terminación con barniz brillante. 35 × 35 × 5 cm.',
                'precio'      => 19000.00,
            ],
            21 => [
                'descripcion' => 'Juego completo de 6 platos (2 llanos + 2 hondos + 2 de postre) en vitrofusión multicolor. Apto lavavajillas y microondas.',
                'precio'      => 48000.00,
            ],
            22 => [
                'descripcion' => 'Set de 4 platos en cerámica color aqua con borde artesanal. Diámetro 26 cm. Apto horno, microondas y lavavajillas.',
                'precio'      => 22000.00,
            ],
            23 => [
                'descripcion' => 'Bowl de vitrofusión inspirado en la estética Tao con diseño bicolor yin-yang. Diámetro 18 cm. Ideal para decoración o uso en mesa.',
                'precio'      => 14500.00,
            ],
            24 => [
                'descripcion' => 'Bowl de cerámica artesanal esmaltado en colores neutros. Capacidad 600 ml. Apto microondas y lavavajillas. Diámetro 16 cm.',
                'precio'      => 11200.00,
            ],
            25 => [
                'descripcion' => 'Set de 3 cuadros en vitrofusión con estética minimalista y paleta monocromática. Tamaños 20×20, 15×15 y 10×10 cm. Para colgar.',
                'precio'      => 32000.00,
            ],
            26 => [
                'descripcion' => 'Colección de piezas decorativas en vitrofusión de distintos tamaños y colores. Ideal para componer ambientes. Set de 5 piezas.',
                'precio'      => 27500.00,
            ],

            // ── TEXTIL ─────────────────────────────────────────────────────
            27 => [
                'descripcion' => 'Traje de fiesta de dos piezas confeccionado a medida en lana merino. Corte italiano slim fit. Incluye saco y pantalón. Colores oscuros disponibles.',
                'precio'      => 145000.00,
            ],
            28 => [
                'descripcion' => 'Set de 3 camisetas de fútbol en tela técnica transpirable. Sublimación de alta duración. Tallas XS a XXL. Personalización disponible.',
                'precio'      => 24000.00,
            ],
            29 => [
                'descripcion' => 'Conjunto casual compuesto por saquito de lana tejido artesanal y jeans de corte recto. Disponible en colores variados. Tallas S a XL.',
                'precio'      => 58000.00,
            ],
            30 => [
                'descripcion' => 'Conjunto urbano en tonos rojos con buzo oversize y jeans slim. Algodón premium. Estampado exclusivo. Tallas XS a XXL.',
                'precio'      => 52000.00,
            ],
            31 => [
                'descripcion' => 'Buzo urbano en algodón orgánico color aqua. Capucha doble y bolsillo canguro. Acabado suave al tacto. Tallas XS a XXL.',
                'precio'      => 34000.00,
            ],
            32 => [
                'descripcion' => 'Mono de una pieza en tela verde militar. Bolsillos laterales funcionales, cinturón incluido. Ideal para eventos. Tallas S a XL.',
                'precio'      => 68000.00,
            ],
            33 => [
                'descripcion' => 'Conjunto deportivo completo: calza y remera en tela técnica de secado rápido. Disponible en 4 colores. Tallas XS a XL.',
                'precio'      => 35000.00,
            ],

            // ── CARPINTERÍA ────────────────────────────────────────────────
            34 => [
                'descripcion' => 'Grabado personalizado en cuadro de madera de pino o roble (a elección del cliente). Motivos florales, geométricos o texto. 30 × 40 cm.',
                'precio'      => 21000.00,
            ],
            35 => [
                'descripcion' => 'Grabado decorativo a router CNC sobre puerta de madera (a elección del cliente). Diseños personalizables en madera de pino o cedro.',
                'precio'      => 48000.00,
            ],
            36 => [
                'descripcion' => 'Caballete artesanal de roble macizo de 2 metros de altura. Estructura con articulación regulable y base de trípode reforzada. Ideal para artistas.',
                'precio'      => 95000.00,
            ],
            37 => [
                'descripcion' => 'Escritorio de madera maciza con 2 estanterías laterales integradas. Espacio de trabajo 120 × 60 cm. Terminación en barniz mate. Fácil armado.',
                'precio'      => 185000.00,
            ],
            38 => [
                'descripcion' => 'Sillón individual con estructura tallada a mano en madera de algarrobo. Tapizado en tela. Motivos florales en respaldo y apoyabrazos.',
                'precio'      => 120000.00,
            ],
            39 => [
                'descripcion' => 'Autito de madera de cedro tallado y lijado a mano. Ruedas móviles de madera. Apto para decoración y juguete. 15 cm de largo.',
                'precio'      => 8500.00,
            ],
            40 => [
                'descripcion' => 'Figura de mono tallada en madera de pino con detalles pintados a mano. Pieza única de colección. 25 cm de alto.',
                'precio'      => 12500.00,
            ],
        ];

        $actualizados = 0;
        $omitidos     = 0;

        foreach ($datos as $id => $campos) {
            $producto = DB::table('productos')->where('id', $id)->first();

            if (!$producto) {
                $this->command->warn("Producto ID {$id} no encontrado, omitido.");
                $omitidos++;
                continue;
            }

            // Solo actualizar si los campos siguen siendo NULL
            $update = [];
            if (is_null($producto->descripcion)) {
                $update['descripcion'] = $campos['descripcion'];
            }
            if (is_null($producto->precio)) {
                $update['precio'] = $campos['precio'];
            }

            if (!empty($update)) {
                $update['updated_at'] = now();
                DB::table('productos')->where('id', $id)->update($update);
                $this->command->info("✓ ID {$id} — {$producto->titulo}");
                $actualizados++;
            } else {
                $this->command->line("  ID {$id} ya tiene datos, omitido.");
                $omitidos++;
            }
        }

        $this->command->info("─────────────────────────────────────────");
        $this->command->info("Completado: {$actualizados} actualizados, {$omitidos} omitidos.");
    }
}
