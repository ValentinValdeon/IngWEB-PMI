<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductoController; 
use App\Http\Controllers\RubroController;
use App\Http\Controllers\SubrubroController;
use App\Http\Controllers\ConsultaController;


Route::get('/rubros', [RubroController::class, 'index']);
Route::post('/rubros', [RubroController::class, 'store']);
Route::put('/rubros/{id}', [RubroController::class, 'update']);
Route::delete('/rubros/{id}', [RubroController::class, 'destroy']);
Route::post('/subrubros', [SubrubroController::class, 'store']);
Route::put('/subrubros/{id}', [SubrubroController::class, 'update']);
Route::delete('/subrubros/{id}', [SubrubroController::class, 'destroy']);


Route::get('/productos', [ProductoController::class, 'index']);
Route::post('/productos', [ProductoController::class, 'store']);
Route::post('/productos/{id}', [ProductoController::class, 'update']);
Route::delete('/productos/{id}', [ProductoController::class, 'destroy']);

Route::post('/consulta', [ConsultaController::class, 'store']);