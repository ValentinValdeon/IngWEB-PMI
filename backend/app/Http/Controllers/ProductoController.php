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


        if ($request->hasFile('imagen')) {
            // defualt se guarda en storage/app/public/productos
            $rutaImagen = $request->file('imagen')->store('productos', 'public');


            $datos['ruta_imagen'] = $rutaImagen;
        }

        $producto = Producto::create($datos);

        // json
        return response()->json([
            'mensaje' => 'producto creado',
            'producto' => $producto
        ], 201); // http
    }


    public function index()
    {
        // productos ordenados y el mas nuevo
        $productos = Producto::orderBy('id', 'desc')->get();
        return response()->json($productos);
    }

    public function destroy($id)
    {
        $producto = Producto::findOrFail($id);
        $producto->delete();

        return response()->json(['mensaje' => 'producto eliminado']);
    }

}