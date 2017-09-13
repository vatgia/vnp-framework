<?php

/**
 * Xem hướng dẫn sử dụng app('route') tại link:
 * https://github.com/mrjgreen/phroute
 */

use VatGia\Helpers\Facade\Route;

Route::filter('auth', function () use ($app) {
    if (!app('user')->logged) {
        return redirect('/login');
    }

    return null;
});


Route::get(
    ['/', 'index'],
    [\AppView\Controllers\HomeController::class, 'render'],
    [
//        'before' => ['auth'],
    ]
);

Route::get(
    ['/login', 'login'],
    [AppView\Controllers\Auth\AuthController::class, 'showLoginForm']
);

Route::get(
    ['/idvg/login-callback', 'login-callback'],
    [AppView\Controllers\Auth\AuthController::class, 'loginCallback']
);

Route::get(
    ['/logout', 'logout'],
    [AppView\Controllers\Auth\AuthController::class, 'logout']
);

Route::get(
    ['/profile', 'profile'],
    [AppView\Controllers\Auth\AuthController::class, 'showProfile'],
    [
        'before' => ['auth'],
    ]
);
