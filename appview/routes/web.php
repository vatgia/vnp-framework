<?php

/**
 * Xem hướng dẫn sử dụng app('route') tại link:
 * https://github.com/mrjgreen/phroute
 */


use VatGia\Helpers\Facade\Route;

Route::get(
    ['/', 'index'],
    [\AppView\Controllers\HomeController::class, 'render']
);

Route::get(
    ['/login', 'login'],
    [\AppView\Controllers\Auth\AuthController::class, 'showLoginForm']
);

Route::get(
    ['/register', 'register'],
    [
        \AppView\Controllers\Auth\AuthController::class, 'register'
    ]
);
Route::post(
    ['/register', 'register.post'],
    [
        \AppView\Controllers\Auth\AuthController::class, 'postRegister'
    ]
);

Route::group([
    'before' => [
        \AppView\Middlewares\LoginRequire::class
    ]
], function () {

    Route::get(
        ['/logout', 'logout'],
        [\AppView\Controllers\Auth\AuthController::class, 'logout']
    );

});
