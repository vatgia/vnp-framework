<?php
/**
 * Created by ntdinh1987.
 * User: ntdinh1987
 * Date: 12/3/16
 * Time: 12:12 AM
 */

return [
    'dir' => '/appview/views/',
    'extension' => '.html.php',
    'ob_callback' => function ($content) {
        return $content;
    }
];