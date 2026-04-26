<?php

namespace App\Http\Controllers;
use App\Models\Rubro;
use Illuminate\Http\Request;

class RubroController extends Controller
{
    public function index() {
        //  todos los rubros y incluimos sus subrubros
        return response()->json(Rubro::with('subrubros')->get());
    }

    public function store(Request $request) {
        $datos = $request->validate(['nombre' => 'required|string']);
        return response()->json(Rubro::create($datos));
    }
}