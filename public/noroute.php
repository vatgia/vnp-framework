<?php

require_once dirname(__FILE__) . '/../bootstrap/bootstrap.php';

$controller = new \AppView\Controllers\HomeController();
echo $controller->render();