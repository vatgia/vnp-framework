<?php

/**
 * Xem hướng dẫn sử dụng app('route') tại link:
 * https://github.com/mrjgreen/phroute
 */

app()->register('route', function () {
    $route = new \Phroute\Phroute\RouteCollector();
    return $route;
});


app('route')->get('/', function () {
    $controller = new \AppView\Controllers\HomeController();
    return $controller->render();
});

app('route')->get('/posts/{slug}-{id}', function ($slug, $id) {
    return $slug . '-' . $id;
});

//Filter
app('route')->filter('auth', function () {
    if (!app('user')->logged) {
        return redirect('/login');
    }
});

app('route')->get('/login', [AppView\Controllers\Auth\AuthController::class, 'showLoginForm']);
app('route')->get('/idvg/login-callback', [AppView\Controllers\Auth\AuthController::class, 'loginCallback']);

app('route')->get('/logout', [AppView\Controllers\Auth\AuthController::class, 'logout']);

app('route')->get('/profile', [AppView\Controllers\Auth\AuthController::class, 'showProfile'], [
    'before' => 'auth'
]);