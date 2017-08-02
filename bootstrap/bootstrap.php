<?php
//Disable for fix session locking
//session_start();
define('APP_START', microtime(true));

defined('ROOT') OR define('ROOT', realpath(dirname(__FILE__) . '/../'));

require_once ROOT . '/vendor/autoload.php';

$app = new \VatGia\Application();

require_once dirname(__FILE__) . '/container.php';

/**
 * Shutdown function
 */

register_shutdown_function(app('shutdown'));
$app->boot();

