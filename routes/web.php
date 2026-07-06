<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\GalleryController;
use App\Http\Controllers\Admin\LoginController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::middleware('guest')->group(function () {
    Route::get('/register', [LoginController::class, 'register_page'])->name('register');
    Route::post('/register', [LoginController::class, 'register'])->name('register.store');
    Route::get('/login', [LoginController::class, 'login_page'])->name('login');
    Route::post('/login', [LoginController::class, 'login'])->name('login.store');
});

Route::middleware(['auth', 'role:admin,super_admin'])->prefix('admin')->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
    Route::post('/logout', [LoginController::class, 'logout'])->name('logout');

    Route::resource('gallery', GalleryController::class)->except(['show']);
    Route::put('/gallery/{gallery}/restore', [GalleryController::class, 'restore'])->name('gallery.restore')->withTrashed();
    Route::delete('/gallery/{gallery}/force-delete', [GalleryController::class, 'forceDelete'])->name('gallery.forceDelete')->withTrashed();
});
