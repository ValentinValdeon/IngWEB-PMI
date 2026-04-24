<?php
# php artisan make:model Producto -m
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{


    protected $fillable = [
        'titulo',
        'descripcion',
        'precio',
        'ruta_imagen',
        'rubro_id',
        'subrubro_id'
    ];

    public function rubro()
    {
        return $this->belongsTo(Rubro::class);
    }

    public function subrubro()
    {
        return $this->belongsTo(Subrubro::class);
    }




}
