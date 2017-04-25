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

$router->get('/test-insert', function () {

    $model = new VatGia\Model\ModelBase('test');

    $model->select_all();

    $faker = Faker\Factory::create();

    $id = $model->insert([
        'title' => $faker->sentence,
        'content' => $faker->text,
        'date' => $faker->date('Y-m-d H:i:s')
    ]);

    return $id;

});

try {
    # NB. You can cache the return value from $router->getData() so you don't have to create the routes each request - massive speed gains
    $dispatcher = new Phroute\Phroute\Dispatcher($router->getData());

    $response = $dispatcher->dispatch($_SERVER['REQUEST_METHOD'], parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

// Print out the value returned from the dispatched function
    echo $response;
} catch (\Phroute\Phroute\Exception\HttpRouteNotFoundException $e) {

    http_response_code(404);
    include 'notfound.php';

} catch (\Phroute\Phroute\Exception\HttpMethodNotAllowedException $e) {

    http_response_code(405);
    include 'notfound.php';

} catch (Exception $e) {


    throw $e;
//    http_response_code(400);
//    include 'notfound.php';

} finally {
}



//include ROOT . '/appview/views/debug/footer.html.php';

