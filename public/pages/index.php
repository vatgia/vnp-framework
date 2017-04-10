<?php

require_once dirname(__FILE__) . '/../config.php';


use Phroute\Phroute\RouteCollector;

$router = new RouteCollector();

$router->get('/', function () {
    $controller = new \AppView\Controllers\HomeController();
    return $controller->render();
});

$router->get('/test', [\AppView\Controllers\HomeController::class, 'render']);

$router->get('/posts/{slug}-{id}', function ($slug, $id) {
    return $slug . '-' . $id;
});

# NB. You can cache the return value from $router->getData() so you don't have to create the routes each request - massive speed gains
$dispatcher = new Phroute\Phroute\Dispatcher($router->getData());

$response = $dispatcher->dispatch($_SERVER['REQUEST_METHOD'], parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

// Print out the value returned from the dispatched function
echo $response;


//include ROOT . '/appview/views/debug/footer.html.php';

