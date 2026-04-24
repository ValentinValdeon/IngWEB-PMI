<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductoController; 
use App\Http\Controllers\RubroController;
use App\Http\Controllers\SubrubroController;


Route::get('/rubros', [RubroController::class, 'index']);
Route::post('/rubros', [RubroController::class, 'store']);
Route::post('/subrubros', [SubrubroController::class, 'store']);


Route::get('/productos', [ProductoController::class, 'index']);
Route::post('/productos', [ProductoController::class, 'store']);
Route::delete('/productos/{id}', [ProductoController::class, 'destroy']);