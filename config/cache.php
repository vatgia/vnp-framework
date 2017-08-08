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
     * -------------------------------------------------------------
     * Repository cache in app
     * -------------------------------------------------------------
     *
     * When devview call the cache.
     * System will call model('config/cache')->load()
     * with cache store and agrumets
     * Eg:
     * Cache::put($key, $value)
     * <-> model('config/cache')->load(['store' => 'file', 'agruments' => [$key, $value]])
     */
    'repository' => 'config/cache',

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