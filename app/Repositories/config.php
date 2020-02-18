<?php

//Lấy config từ các thư mục con và merge vào
$config = [];

foreach (glob(realpath(dirname(__FILE__)) . '/*/config.php') as $repoConfigFile) {
    $repoConfig = include $repoConfigFile;
    if (is_array($repoConfig)) {
        $config = array_merge($config, $repoConfig);
    }

}
foreach(glob(realpath(dirname(__FILE__)) . '/*/*/config.php') as $repoConfigFile)
{
    $repoConfig = include $repoConfigFile;

    $config = array_merge($config, $repoConfig);
}

return $config;