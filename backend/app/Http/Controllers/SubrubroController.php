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

    public function update(Request $request, $id) {
        $request->validate([
            'nombre' => 'required|string|max:255',
        ]);

        $subrubro = Subrubro::findOrFail($id);
        $subrubro->update(['nombre' => $request->nombre]);

        return response()->json($subrubro);
    }

    public function destroy($id) {
        $subrubro = Subrubro::findOrFail($id);
        $subrubro->delete();

        return response()->json(['message' => 'Subrubro eliminado']);
    }
}