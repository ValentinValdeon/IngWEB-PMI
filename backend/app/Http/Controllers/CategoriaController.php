<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use App\Models\CategoriaOpcion;
use Illuminate\Http\Request;

class CategoriaController extends Controller
{
    public function index()
    {
        return response()->json(Categoria::with('opciones')->orderBy('nombre')->get());
    }

    public function getPorSubrubro($subrubroId)
    {
        $categorias = Categoria::with('opciones')
            ->whereHas('subrubros', fn($q) => $q->where('subrubros.id', $subrubroId))
            ->get();

        return response()->json($categorias);
    }

    public function linkToSubrubro(Request $request)
    {
        $datos = $request->validate([
            'categoria_id' => 'required|exists:categorias,id',
            'subrubro_id' => 'required|exists:subrubros,id',
        ]);

        $categoria = Categoria::findOrFail($datos['categoria_id']);
        if (!$categoria->subrubros()->where('subrubros.id', $datos['subrubro_id'])->exists()) {
            $categoria->subrubros()->attach($datos['subrubro_id']);
        }

        return response()->json($categoria->load('opciones'));
    }

    public function store(Request $request)
    {
        $datos = $request->validate(['nombre' => 'required|string']);

        $categoria = Categoria::create(['nombre' => $datos['nombre']]);

        if (!empty($datos['subrubro_id'])) {
            $categoria->subrubros()->attach($datos['subrubro_id']);
        }

        return response()->json($categoria->load('opciones'), 201);
    }

    public function update(Request $request, $id)
    {
        $request->validate(['nombre' => 'required|string|max:255']);

        $categoria = Categoria::findOrFail($id);
        $categoria->update(['nombre' => $request->nombre]);

        return response()->json($categoria->load('opciones'));
    }

    public function destroy($id)
    {
        $categoria = Categoria::findOrFail($id);
        $categoria->delete();

        return response()->json(['message' => 'Categoría eliminada']);
    }

    public function storeOpcion(Request $request, $id)
    {
        $request->validate(['nombre' => 'required|string']);

        $categoria = Categoria::findOrFail($id);
        $opcion = CategoriaOpcion::create([
            'categoria_id' => $categoria->id,
            'nombre' => $request->nombre,
        ]);

        return response()->json($opcion, 201);
    }

    public function updateOpcion(Request $request, $id)
    {
        $request->validate(['nombre' => 'required|string|max:255']);

        $opcion = CategoriaOpcion::findOrFail($id);
        $opcion->update(['nombre' => $request->nombre]);

        return response()->json($opcion);
    }

    public function destroyOpcion($id)
    {
        $opcion = CategoriaOpcion::findOrFail($id);
        $opcion->delete();

        return response()->json(['message' => 'Opción eliminada']);
    }
}