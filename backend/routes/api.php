<?php

use App\Http\Controllers\AuthController;

Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:api')->get('/user', [AuthController::class, 'me']);
Route::get('/test', function () {
    return response()->json(['message' => 'API is working!']);
});