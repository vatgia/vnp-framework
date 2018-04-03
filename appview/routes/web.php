<?php

/**
 * Xem hướng dẫn sử dụng app('route') tại link:
 * https://github.com/mrjgreen/phroute
 */

use VatGia\Helpers\Facade\Route;

Route::filter('auth', function () use ($app) {
    if (!app('auth')->logged) {
        redirect('/login');

        exit;
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

Route::get('/welcome/{lang}', function ($lang) {

    app('translator')->setLocale($lang);

    echo trans('messages.welcome', 'Xin chào đồng chí {name}', ['name' => 'Định']);
    echo trans('messages.welcome', 'Xin chào đồng chí {name}', ['name' => 'Lê']);
    echo trans('messages.welcome', 'Xin chào đồng chí {name}', ['name' => 'Mon']);

});

Route::get(['/posts/{slug}-{id}', 'post_detail'], [\AppView\Controllers\PostController::class, 'detail']);

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
