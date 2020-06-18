<?php
/**
 * Created by ntdinh1987.
 * User: ntdinh1987
 * Date: 12/3/16
 * Time: 5:34 PM
 */

$prelink = '/vendor/maximebf/debugbar/src/DebugBar/Resources/';

$resource = isset($_GET['resource']) ? $_GET['resource'] : '';

$resourceFile = realpath(dirname(__FILE__) . '/../../') . $prelink . $resource;

$extension = explode('.', $resource);
switch (end($extension)) {
    case 'js':
        header('Content-Type: application/javascript');
        break;
    case 'css':
    header('Content-Type: text/css');
        break;
    case 'ttf':
        break;
    case 'woff':
        break;
    case 'woff2':
        break;
    default:
        exit;
        break;
}

echo file_get_contents($resourceFile);