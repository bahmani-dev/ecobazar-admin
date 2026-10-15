<?php

use App\Http\Controllers\Admin\ActivityLogController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Admin routes
|--------------------------------------------------------------------------
| In routes/web.php add:
|
|   require __DIR__.'/admin.php';
|
| These sit behind ['auth', 'verified', 'role:super_admin,admin,manager,support']
| so any authenticated admin-side user can reach /admin, while individual
| actions are further locked down by permission: middleware and Policies.
*/

Route::middleware(['auth', 'verified', 'role:super_admin,admin,manager,support'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

        Route::get('/', DashboardController::class)->name('dashboard');

        Route::middleware('permission:users.view')->group(function () {
            Route::get('users', [UserController::class, 'index'])->name('users.index');
        });
        Route::middleware('permission:users.create')->group(function () {
            Route::get('users/create', [UserController::class, 'create'])->name('users.create');
            Route::post('users', [UserController::class, 'store'])->name('users.store');
        });
        Route::middleware('permission:users.update')->group(function () {
            Route::get('users/{user}/edit', [UserController::class, 'edit'])->name('users.edit');
            Route::put('users/{user}', [UserController::class, 'update'])->name('users.update');
        });
        Route::middleware('permission:users.delete')->group(function () {
            Route::delete('users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
        });

        Route::middleware('permission:roles.view')->group(function () {
            Route::get('roles', [RoleController::class, 'index'])->name('roles.index');
        });

        Route::middleware('permission:activity_log.view')->group(function () {
            Route::get('activity-log', [ActivityLogController::class, 'index'])->name('activity-log.index');
        });
    });