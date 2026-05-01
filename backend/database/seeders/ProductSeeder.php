<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ProductSeeder extends Seeder
{
    /**
     * Descarga una imagen desde una URL y la guarda en storage/app/public/productos/.
     * Retorna el path relativo (ej. "productos/seed_carteras.jpg") o null si falla.
     */
    private function descargarImagen(string $url, string $nombre): ?string
    {
        try {
            $contexto = stream_context_create([
                'http' => [
                    'timeout'          => 15,
                    'follow_location'  => true,
                    'user_agent'       => 'Mozilla/5.0 (compatible; Seeder/1.0)',
                ],
                'ssl' => [
                    'verify_peer'      => false,
                    'verify_peer_name' => false,
                ],
            ]);

            $contenido = @file_get_contents($url, false, $contexto);

            if ($contenido === false || strlen($contenido) < 1000) {
                return null;
            }

            $filename = 'seed_' . $nombre . '.jpg';
            Storage::disk('public')->put('productos/' . $filename, $contenido);

            return 'productos/' . $filename;
        } catch (\Exception $e) {
            return null;
        }
    }

    public function run(): void
    {
        // Limpiar productos de prueba anteriores
        DB::table('productos')->delete();

        // Asegurar que existe el directorio
        Storage::disk('public')->makeDirectory('productos');

        // Obtener IDs de rubros y subrubros ya insertados por RubroSeeder
        $rubros    = DB::table('rubros')->pluck('id', 'nombre');
        $subrubros = DB::table('subrubros')->pluck('id', 'nombre');

        // -------------------------------------------------------------------
        // Cada entrada: [rubro, subrubro, titulo, descripcion, precio, url_imagen]
        // Imágenes: Unsplash con parámetros w=800&q=80 (URL directa estable)
        // -------------------------------------------------------------------
        $productos = [

            // ── MARROQUINERÍA ──────────────────────────────────────────────
            [
                'rubro'       => 'Marroquinería',
                'subrubro'    => 'Carteras',
                'titulo'      => 'Tote Bag Cuero Natural',
                'descripcion' => 'Tote bag artesanal en cuero vacuno natural curtido al vegetal. Capacidad amplia, asas dobles reforzadas. 42 × 38 × 12 cm.',
                'precio'      => 48500.00,
                'img_url'     => 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80',
            ],
            [
                'rubro'       => 'Marroquinería',
                'subrubro'    => 'Billeteras',
                'titulo'      => 'Billetera Slim Femenina',
                'descripcion' => 'Billetera compacta línea femenina en cuero liso. 8 ranuras para tarjetas, porta billete y monedero. 19 × 10 cm cerrada.',
                'precio'      => 18900.00,
                'img_url'     => 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80',
            ],
            [
                'rubro'       => 'Marroquinería',
                'subrubro'    => 'Mochilas',
                'titulo'      => 'Mochila Urbana Cuero',
                'descripcion' => 'Mochila urbana en cuero engrasado marrón oscuro. Compartimento principal + bolsillo frontal con cierre. 30 × 40 × 15 cm.',
                'precio'      => 72000.00,
                'img_url'     => 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
            ],
            [
                'rubro'       => 'Marroquinería',
                'subrubro'    => 'Cinturones',
                'titulo'      => 'Cinturón de Vestir Negro',
                'descripcion' => 'Cinturón de vestir en cuero plena flor negro. Hebilla dorada. Ancho 3 cm. Tallas 90 a 120 cm.',
                'precio'      => 14500.00,
                'img_url'     => 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80',
            ],
            [
                'rubro'       => 'Marroquinería',
                'subrubro'    => 'Calzado',
                'titulo'      => 'Mocasín Artesanal Cuero',
                'descripcion' => 'Mocasín confeccionado a mano en cuero vacuno. Suela de cuero cosida. Disponible en marrón y negro. Tallas 36–45.',
                'precio'      => 54000.00,
                'img_url'     => 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800&q=80',
            ],
            [
                'rubro'       => 'Marroquinería',
                'subrubro'    => 'Bolsos',
                'titulo'      => 'Bolso Marinero Cuero',
                'descripcion' => 'Bolso marinero de fin de semana en cuero curtido. Cierre superior con hebillas laterales. 50 × 28 × 25 cm.',
                'precio'      => 89000.00,
                'img_url'     => 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&q=80',
            ],

            // ── VITROFUSIÓN ────────────────────────────────────────────────
            [
                'rubro'       => 'Vitrofusión',
                'subrubro'    => 'Bazar - Platos',
                'titulo'      => 'Plato Principal Vitrofusión',
                'descripcion' => 'Plato redondo para presentación principal en vidrio fusionado. Técnica de capas. Diámetro 28 cm. Apto microondas.',
                'precio'      => 12800.00,
                'img_url'     => 'https://images.unsplash.com/photo-1604250833285-86cbf1e65b50?w=800&q=80',
            ],
            [
                'rubro'       => 'Vitrofusión',
                'subrubro'    => 'Bazar - Bandejas',
                'titulo'      => 'Bandeja Rectangular Vitrofusión',
                'descripcion' => 'Bandeja rectangular en vidrio fusionado multicolor. Ideal para aperitivos. 35 × 20 cm.',
                'precio'      => 16400.00,
                'img_url'     => 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&q=80',
            ],
            [
                'rubro'       => 'Vitrofusión',
                'subrubro'    => 'Bazar - Fuentes',
                'titulo'      => 'Fuente Redonda Vitrofusión',
                'descripcion' => 'Fuente redonda para servir en vidrio fusionado. Colores tierra. Diámetro 32 cm. Resistente al calor.',
                'precio'      => 19200.00,
                'img_url'     => 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=800&q=80',
            ],
            [
                'rubro'       => 'Vitrofusión',
                'subrubro'    => 'Bazar - Pizzeras',
                'titulo'      => 'Pizzera Grande Vitrofusión',
                'descripcion' => 'Pizzera grande en vidrio fusionado resistente al calor. Diámetro 36 cm. Bordes reforzados.',
                'precio'      => 22500.00,
                'img_url'     => 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80',
            ],
            [
                'rubro'       => 'Vitrofusión',
                'subrubro'    => 'Bazar - Paneras',
                'titulo'      => 'Panera Mediana Vitrofusión',
                'descripcion' => 'Panera mediana en vidrio fusionado con diseño artesanal. 25 × 20 cm. Ideal para mesa.',
                'precio'      => 11800.00,
                'img_url'     => 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=80',
            ],
            [
                'rubro'       => 'Vitrofusión',
                'subrubro'    => 'Decoración',
                'titulo'      => 'Mandala Vitrofusión',
                'descripcion' => 'Mandala decorativo elaborado en vitrofusión con técnica de inclusión de millefiori. 30 cm de diámetro. Para colgar.',
                'precio'      => 28000.00,
                'img_url'     => 'https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?w=800&q=80',
            ],

            // ── TEXTIL ─────────────────────────────────────────────────────
            [
                'rubro'       => 'Textil',
                'subrubro'    => 'Indumentaria Fiesta',
                'titulo'      => 'Vestido de Fiesta Artesanal',
                'descripcion' => 'Vestido largo confeccionado a mano en tela de seda natural. Bordados exclusivos. Disponible en tallas S a XL.',
                'precio'      => 95000.00,
                'img_url'     => 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&q=80',
            ],
            [
                'rubro'       => 'Textil',
                'subrubro'    => 'Indumentaria Urbana',
                'titulo'      => 'Conjunto Urbano Algodón',
                'descripcion' => 'Conjunto compuesto por pantalón y buzo en algodón orgánico. Estampado exclusivo. Tallas XS a XXL.',
                'precio'      => 42000.00,
                'img_url'     => 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
            ],
            [
                'rubro'       => 'Textil',
                'subrubro'    => 'Indumentaria Deportiva',
                'titulo'      => 'Set Deportivo Técnico',
                'descripcion' => 'Set deportivo en tela técnica transpirable. Calza y top combinables. Disponible en 5 colores. Tallas XS a XL.',
                'precio'      => 38500.00,
                'img_url'     => 'https://images.unsplash.com/photo-1518310383802-640c2de311b6?w=800&q=80',
            ],
            [
                'rubro'       => 'Textil',
                'subrubro'    => 'Línea Femenino',
                'titulo'      => 'Blusa Artesanal Bordada',
                'descripcion' => 'Blusa femenina en lino natural con bordados a mano en hilo de seda. Cuello en V. Tallas S a XL.',
                'precio'      => 29800.00,
                'img_url'     => 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=800&q=80',
            ],
            [
                'rubro'       => 'Textil',
                'subrubro'    => 'Línea Masculino',
                'titulo'      => 'Camisa Masculina Lino',
                'descripcion' => 'Camisa masculina adulto en lino lavado. Corte regular. Botones de nácar. Tallas S a XXXL.',
                'precio'      => 27500.00,
                'img_url'     => 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80',
            ],

            // ── CARPINTERÍA ────────────────────────────────────────────────
            [
                'rubro'       => 'Carpintería',
                'subrubro'    => 'Tallado',
                'titulo'      => 'Talla en Madera Relieve',
                'descripcion' => 'Talla decorativa en madera de cedro. Motivo floral en alto relieve. 40 × 30 cm. Terminación en cera natural.',
                'precio'      => 35000.00,
                'img_url'     => 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
            ],
            [
                'rubro'       => 'Carpintería',
                'subrubro'    => 'Grabado',
                'titulo'      => 'Grabado Decorativo Nogal',
                'descripcion' => 'Panel de madera de nogal con grabado geométrico a router CNC y repaso artesanal. 50 × 35 cm.',
                'precio'      => 28000.00,
                'img_url'     => 'https://images.unsplash.com/photo-1416339306562-f3d12fefd36f?w=800&q=80',
            ],
            [
                'rubro'       => 'Carpintería',
                'subrubro'    => 'Mobiliario',
                'titulo'      => 'Mesa Ratona Artesanal',
                'descripcion' => 'Mesa ratona en madera maciza de algarrobo con terminación al aceite. 80 × 60 × 45 cm. Capacidad de carga 30 kg.',
                'precio'      => 145000.00,
                'img_url'     => 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80',
            ],
        ];

        foreach ($productos as $p) {
            $rubroId    = $rubros[$p['rubro']]    ?? null;
            $subrubroId = $subrubros[$p['subrubro']] ?? null;

            if (!$rubroId || !$subrubroId) {
                $this->command->warn("Rubro/Subrubro no encontrado: {$p['rubro']} / {$p['subrubro']}");
                continue;
            }

            // Nombre de archivo limpio basado en el subrubro
            $nombreArchivo = strtolower(preg_replace('/[^a-z0-9]/i', '_', $p['subrubro']));

            $this->command->info("Descargando imagen para: {$p['titulo']}...");
            $rutaImagen = $this->descargarImagen($p['img_url'], $nombreArchivo);

            if (!$rutaImagen) {
                $this->command->warn("  → Falló la descarga, se guardará sin imagen.");
            } else {
                $this->command->info("  → OK: {$rutaImagen}");
            }

            DB::table('productos')->insert([
                'rubro_id'    => $rubroId,
                'subrubro_id' => $subrubroId,
                'titulo'      => $p['titulo'],
                'descripcion' => $p['descripcion'],
                'precio'      => $p['precio'],
                'ruta_imagen' => $rutaImagen,
                'created_at'  => now(),
                'updated_at'  => now(),
            ]);
        }

        $this->command->info('ProductSeeder completado: ' . count($productos) . ' productos insertados.');
    }
}
