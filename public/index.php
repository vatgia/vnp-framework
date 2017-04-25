<?php

require_once dirname(__FILE__) . '/../bootstrap/bootstrap.php';
require_once dirname(__FILE__) . '/../appview/routes.php';

try {
    # NB. You can cache the return value from $router->getData() so you don't have to create the routes each request - massive speed gains
    $dispatcher = new Phroute\Phroute\Dispatcher(app('route')->getData());

    $response = $dispatcher->dispatch($_SERVER['REQUEST_METHOD'], parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

    // Print out the value returned from the dispatched function
    echo $response;
} catch (\Phroute\Phroute\Exception\HttpRouteNotFoundException $e) {

    http_response_code(404);
    include 'pages/notfound.php';

} catch (\Phroute\Phroute\Exception\HttpMethodNotAllowedException $e) {

    http_response_code(405);
    include 'pages/notfound.php';

} catch (Exception $e) {


    throw $e;
    //    http_response_code(400);
    //    include 'notfound.php';

} finally {
}