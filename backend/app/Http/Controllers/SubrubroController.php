<?php

namespace App\Http\Controllers;
use App\Models\Subrubro;
use Illuminate\Http\Request;

class SubrubroController extends Controller
{
    public function store(Request $request) {
        $datos = $request->validate([
            'nombre' => 'required|string',
            'rubro_id' => 'required|exists:rubros,id'
        ]);
        return response()->json(Subrubro::create($datos));
    }
}