<?php
/**
 * Created by PhpStorm.
 * User: Stephen Nguyen
 * Date: 5/24/2017
 * Time: 3:50 PM
 */

$argrument = isset($argv[2]) ? trim($argv[2]) : false;

if (!$argrument) {
    return 'action not found
    --config: Build all config
    --repository: Build all repository config
    ';
}

switch ($argrument) {
    case '--config':
        build_config();
        break;
    case '--repository':
        build_repositoty();
        break;
    default:
        break;
}

function build_config()
{
    $files = glob(ROOT . '/config/*.php');
    $arr_config = [];
    foreach ($files as $file) {
        if (basename($file) != 'all.php') {
            $arr_config[] = '\'' . str_replace('.php', '', basename($file)) . '\' => include dirname(__FILE__) . \'/' . basename($file) . '\',';
        }
    }

    $string = '<?php
return [
    ';
    $string .= implode(PHP_EOL, $arr_config);
    $string .= '
];
    ';

    file_put_contents(ROOT . '/config/all.php', $string);
    return 'Cache config success!';
}

function build_repositoty()
{
    $all_config = [];

    $files = glob(ROOT . '/app/Repositories/*/config.php');
    foreach ($files as $file) {
        $config = require_once $file;
        $all_config = array_merge($all_config, $config);
    }

    $files = glob(ROOT . '/app/Repositories/*/*/config.php');
    foreach ($files as $file) {
        $config = require_once $file;
        $all_config = array_merge($all_config, $config);
    }

    $string = '<?php

return ' . var_export($all_config, true) . ';

';

    file_put_contents(ROOT . '/app/Repositories/config.php', $string);
    return 'Generate App Repositories config success.';
}