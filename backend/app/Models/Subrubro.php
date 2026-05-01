<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Subrubro extends Model
{
    protected $fillable = ["nombre", "rubro_id"];
    public function rubro()
    {
        return $this->belongsTo(Rubro::class);
    }
    public function productos()
    {

        return $this->hasMany(Producto::class);
    }

}
