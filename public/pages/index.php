<?php

require_once dirname(__FILE__) . '/../config.php';

$controller = new \AppView\Controllers\HomeController();

echo $controller->render();

include ROOT . '/appview/views/debug/footer.html.php';

