<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CategoriaOpcion extends Model
{
    protected $table = 'categoria_opciones';
    protected $fillable = [
        'categoria_id',
        'nombre'
    ];

    public function categoria()
    {
        return $this->belongsTo(Categoria::class);
    }

    public function productos()
    {
        return $this->belongsToMany(
            Producto::class,
            'producto_categoria_opcion'
        );
    }
}
