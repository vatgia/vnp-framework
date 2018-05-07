<?php
/**
 * Created by vatgia-framework.
 * Date: 6/26/2017
 * Time: 4:21 PM
 */

return [
    'prefix' => 'api',
    'filter' => [
        'before' => [],
        'after' => []
    ],
    'app_repository_enable' => env('API_APP_REPOSITORY_ENABLE', false),
    'routes' => 'appview/routes/api.php',
];