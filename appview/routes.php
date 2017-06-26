<?php

/**
 * Xem hướng dẫn sử dụng app('route') tại link:
 * https://github.com/mrjgreen/phroute
 */

app()->register('route', function () {
    $route = new \Phroute\Phroute\RouteCollector();
    return $route;
});

app('route')->get('/', [\AppView\Controllers\HomeController::class, 'render']);

app('route')->get(
    ['/posts/{slug}-{id:\d+}', 'post_detail'],
    [\AppView\Controllers\PostController::class, 'detail']
);

//Filter
app('route')->filter('auth', function () {
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


app('route')->get('/api/posts/{id}', [\AppView\Controllers\Api\PostDetailController::class, 'process']);

/**
 * App API wrapper
 */
app('route')->group(
    ['before' => 'api'],
    function ($router) {

        $router->any('/api/{group}', [\VatGia\Api\AppRepositoryController::class, 'process']);
        $router->any('/api/{group}/{name}', [\VatGia\Api\AppRepositoryController::class, 'process']);
        $router->any('/api/{group}/{child_group}/{name}', [\VatGia\Api\AppRepositoryController::class, 'process']);

    },
    [
        //Filter
        //'before' => ['api_auth'],
        //'after' => ['pretty_api_response']
    ]
);
