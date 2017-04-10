<?php
session_start();
define('APP_START', microtime(true));

define('ROOT', realpath(dirname(__FILE__) . '/../'));

define('BASE_URL', '//' . $_SERVER['HTTP_HOST']);


if(is_readable(ROOT . '/app/helpers.php')) {
    require_once ROOT . '/app/helpers.php';
}

require_once ROOT . '/vendor/autoload.php';

\VatGia\LoadEnv::load(ROOT);

$app = new \VatGia\Application();

$app->register('config', function () {
    return \VatGia\Config::load(ROOT . '/config/');
});

define('MYSQL_MAX_TIME_SLOW', config('database.max_time_slow'));

//Prety Exception
if (config('app.debug') && config('app.prety_exception')) {
    $whoops = new \Whoops\Run;
    $whoops->pushHandler(new \Whoops\Handler\PrettyPageHandler);
    $whoops->register();
}

require_once dirname(__FILE__) . '/container.php';


/**
 * Shutdown function
 */

register_shutdown_function(app('shutdown'));

