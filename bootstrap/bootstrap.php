<?php
session_start();
define('APP_START', microtime(true));

defined('ROOT') OR define('ROOT', realpath(dirname(__FILE__) . '/../'));

//define('BASE_URL', '//' . $_SERVER['HTTP_HOST']);


if (is_readable(ROOT . '/app/helpers.php')) {
    require_once ROOT . '/app/helpers.php';
}

require_once ROOT . '/vendor/autoload.php';

\VatGia\LoadEnv::load(ROOT);

$app = new \VatGia\Application();

$app->register('config', function () {
    return \VatGia\Config::load(ROOT . '/config/');
});

defined('MYSQL_MAX_TIME_SLOW') OR define('MYSQL_MAX_TIME_SLOW', config('database.max_time_slow'));

require_once dirname(__FILE__) . '/container.php';

/**
 * Command
 */
\VatGia\Helpers\CommandKernel::register('build:config', \VatGia\Helpers\Commands\BuildConfigCommand::class);
\VatGia\Helpers\CommandKernel::register('make:controller', \VatGia\Helpers\Commands\ControllerGenerateCommand::class);

/**
 * Shutdown function
 */

register_shutdown_function(app('shutdown'));

