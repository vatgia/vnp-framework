<?php
/**
 * Created by vatgia-framework.
 * Date: 8/5/2017
 * Time: 7:56 PM
 */

return [

    /*
     * -------------------------------------------------------------
     * Default Cache Store
     * -------------------------------------------------------------
     *
     */
    'default' => env('CACHE_DRIVER', 'file'),

    /*
     * ------------------------------------------------------------
     * Cache Stores
     * ------------------------------------------------------------
     *
     * Define all driver for cache store
     */

    'stores' => [
        'file' => [
            'driver' => 'file',
            'path' => storage_path('framework/cache'),
        ],
        'memcache' => [
            'driver' => 'memcache',
            'server' => [
                'host' => env('MEMCACHED_HOST', '127.0.0.1'),
                'port' => env('MEMCACHED_PORT', 11211),
                'weight' => 100,
            ],
        ],
        'database' => [
            'driver' => 'database',
            'table' => 'cache',
        ],
    ],
];