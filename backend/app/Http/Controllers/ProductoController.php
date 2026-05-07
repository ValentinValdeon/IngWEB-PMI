<?php

namespace App\Http\Controllers;

use App\Http\Requests\AlmacenarProductoRequest;
use App\Models\Producto;
use App\Http\Requests\StoreProductoRequest; // imp. request
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage; // archivos

class ProductoController extends Controller
{
    public function store(AlmacenarProductoRequest $request)
    {

        $datos = $request->validated();
        unset($datos['imagen']);

        $categoriaOpciones = $datos['categoria_opciones'] ?? [];
        unset($datos['categoria_opciones']);

        if ($request->hasFile('imagen')) {
            $rutaImagen = $request->file('imagen')->store('productos', 'public');
            $datos['ruta_imagen'] = $rutaImagen;
        }

        $producto = Producto::create($datos);

        if (!empty($categoriaOpciones)) {
            $producto->categoriaOpciones()->attach($categoriaOpciones);
        }

        // json
        return response()->json([
            'mensaje' => 'producto creado',
            'producto' => $producto
        ], 201); // http
    }


    public function index(Request $request)
    {
        $query = Producto::with('rubro', 'subrubro', 'categoriaOpciones');

        if ($request->filled('rubro_id')) {
            $query->where('rubro_id', $request->rubro_id);
        }

        if ($request->filled('subrubro_id')) {
            $query->where('subrubro_id', $request->subrubro_id);
        }

        $productos = $query->orderBy('id', 'desc')->get();
        return response()->json($productos);
    }

    public function update(Request $request, $id)
    {
        $producto = Producto::findOrFail($id);

        $request->validate([
            'titulo'       => 'required|string|max:255',
            'descripcion'  => 'nullable|string',
            'precio'       => 'nullable|numeric|min:0',
            'rubro_id'     => 'required|exists:rubros,id',
            'subrubro_id'  => 'nullable|exists:subrubros,id',
            'imagen'       => 'nullable|image|max:5120',
        ]);

        $datos = $request->only(['titulo', 'descripcion', 'precio', 'rubro_id', 'subrubro_id']);
        $categoriaOpciones = $request->input('categoria_opciones', []);

        if ($request->hasFile('imagen')) {
            $path = $request->file('imagen')->store('productos', 'public');
            $datos['ruta_imagen'] = $path;
        }

        $producto->update($datos);
        $producto->categoriaOpciones()->sync($categoriaOpciones);
        $producto->load('rubro', 'subrubro');

        return response()->json($producto);
    }

    public function destroy($id)
    {
        $producto = Producto::findOrFail($id);
        $producto->delete();

        return response()->json(['mensaje' => 'producto eliminado']);
    }

}