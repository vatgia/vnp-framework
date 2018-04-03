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

Route::get(['/posts/{slug}-{id}', 'post.detail'], [\AppView\Controllers\PostController::class, 'detail']);

Route::get(
    ['/login', 'login'],
    [\AppView\Controllers\Auth\AuthController::class, 'showLoginForm']
);

Route::get(
    ['/idvg/login-callback', 'login-callback'],
    [\AppView\Controllers\Auth\AuthController::class, 'loginCallback']
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

    Route::get(
        ['/profile', 'profile'],
        [\AppView\Controllers\Auth\AuthController::class, 'showProfile'],
        [
            'before' => ['auth'],
        ]
    );

});

