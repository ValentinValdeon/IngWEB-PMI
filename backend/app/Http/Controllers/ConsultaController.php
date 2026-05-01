<?php

namespace App\Http\Controllers;

use App\Models\Consulta;
use Illuminate\Http\Request;

class ConsultaController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'nombre'      => 'required|string|max:255',
            'email'       => 'required|email|max:255',
            'mensaje'     => 'required|string',
            'producto_id' => 'nullable|exists:productos,id',
        ]);

        $consulta = Consulta::create($request->only(['nombre', 'email', 'mensaje', 'producto_id']));

        return response()->json($consulta, 201);
    }
}
