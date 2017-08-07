<?php

/**
 * Xem hướng dẫn sử dụng app('route') tại link:
 * https://github.com/mrjgreen/phroute
 */

app('route')->get(['/', 'index'], [\AppView\Controllers\HomeController::class, 'render']);

app('route')->get(
    ['/posts/{slug}-{id:\d+}', 'post_detail'],
    [\AppView\Controllers\PostController::class, 'detail']
);

//Filter
app('route')->filter('auth', function () use ($app) {
    if (!app('user')->logged) {
        return redirect('/login');
    }
});

app('route')->get(['/login', 'login'], [AppView\Controllers\Auth\AuthController::class, 'showLoginForm']);
app('route')->get('/idvg/login-callback', [AppView\Controllers\Auth\AuthController::class, 'loginCallback']);

app('route')->get(['/logout', 'logout'], [AppView\Controllers\Auth\AuthController::class, 'logout']);

app('route')->get(['/profile', 'profile'], [AppView\Controllers\Auth\AuthController::class, 'showProfile'], [
    'before' => ['auth']
]);


app('route')->get('/api/posts/{id:\d+}', [\AppView\Controllers\Api\PostDetailController::class, 'process']);

/**
 * App API wrapper
 */
app('route')->group(
    [
        'prefix' => 'api',
        'before' => '',
        'after' => ''
    ],
    function ($router) {

        $router->any('{group}', [\VatGia\Api\AppRepositoryController::class, 'process']);
        $router->any('{group}/{name}', [\VatGia\Api\AppRepositoryController::class, 'process']);
        $router->any('{group}/{child_group}/{name}', [\VatGia\Api\AppRepositoryController::class, 'process']);

    }
);
