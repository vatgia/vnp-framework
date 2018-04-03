<?php

/**
 * Nếu muốn xử dụng htaccess trỏ từng link đến từng file.
 * Thì các file phải làm theo cấu trúc sau
 */
require_once dirname(__FILE__) . '/../bootstrap/bootstrap.php';

$controller = new \AppView\Controllers\HomeController();
echo $controller->render();