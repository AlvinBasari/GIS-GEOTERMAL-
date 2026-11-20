<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\GeothermalSiteController;
use Illuminate\Support\Facades\Route;

// Authentication
Route::post('/auth/login', [AdminController::class, 'login']);

// Geothermal Sites & Spatial Data Endpoints
Route::prefix('geothermal')->group(function () {
    Route::get('/geojson', [GeothermalSiteController::class, 'geojson']);
    Route::get('/fault-lines', [GeothermalSiteController::class, 'faultLines']);
    Route::get('/statistics', [GeothermalSiteController::class, 'statistics']);
    
    // CRUD endpoints
    Route::get('/sites', [GeothermalSiteController::class, 'index']);
    Route::post('/sites', [GeothermalSiteController::class, 'store']);
    Route::get('/sites/{id}', [GeothermalSiteController::class, 'show']);
    Route::put('/sites/{id}', [GeothermalSiteController::class, 'update']);
    Route::delete('/sites/{id}', [GeothermalSiteController::class, 'destroy']);
});

// Admin Panel GIS Specific Endpoints
Route::prefix('admin')->group(function () {
    Route::get('/audit-logs', [AdminController::class, 'auditLogs']);
    Route::get('/users', [AdminController::class, 'users']);
    Route::post('/spatial-audit', [AdminController::class, 'logSpatialAction']);
    Route::get('/buffer-conflict', [AdminController::class, 'calculateBufferConflict']);
    Route::get('/export/{format}', [AdminController::class, 'exportData']);
});
