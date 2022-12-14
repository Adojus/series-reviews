<?php

use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\SerialasController;
use App\Models\Serialas;

use App\Http\Controllers\Api\KategorijaController;
use App\Models\Kategorija;

use App\Http\Controllers\Api\AktoriusController;
use App\Models\Aktorius;

use App\Http\Controllers\Api\VertinimasController;
use App\Models\Vertinimas;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::controller(AuthController::class)->group(function () {
    Route::get('/auth/login', 'login');
    Route::post('auth/register', 'register');
    Route::get('auth/logout', 'logout');
    Route::post('auth/refresh', 'refresh');
});

//More Laravel way would be to just include Route::apiResource('entities', EntityController::class);
// this is done to include aliases to standard laravel path such as index -> to serialas/list

Route::controller(SerialasController::class)->group(function () {
    Route::get('serialas/list','index');
    Route::post('serialas/create', 'store');
    Route::get('serialas/load', 'show');
    Route::post('serialas/update', 'update');
    Route::get('serialas/delete', 'destroy');
});

Route::controller(KategorijaController::class)->group(function () {
    Route::get('kategorija/list','index');
    Route::post('kategorija/create', 'store');
    Route::get('kategorija/load', 'show');
    Route::post('kategorija/update', 'update');
    Route::get('kategorija/delete', 'destroy');
});

Route::controller(AktoriusController::class)->group(function () {
    Route::get('aktorius/list','index');
    Route::post('aktorius/create', 'store');
    Route::get('aktorius/load', 'show');
    Route::post('aktorius/update', 'update');
    Route::get('aktorius/delete', 'destroy');
});

Route::controller(VertinimasController::class)->group(function () {
    Route::get('vertinimas/list','index');
    Route::post('vertinimas/create', 'store');
    Route::get('vertinimas/load', 'show');
    Route::post('vertinimas/update', 'update');
    Route::get('vertinimas/delete', 'destroy');
});


