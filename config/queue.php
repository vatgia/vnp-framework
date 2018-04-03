<?php
/**
 * Created by vatgia-framework.
 * Date: 8/22/2017
 * Time: 10:46 PM
 */

return [

    /*
     * --------------------------------------------------------------
     * Default Queue Driver
     * --------------------------------------------------------------
     *
     * Driver queue process. Default is 'sync'.
     * Supported: "sync", "database", "redis", "null"
     */
    'driver' => env('QUEUE_DRIVER', 'sync'),

    'sleep' => 2,

    'sleep_when_empty' => 30,

    /*
     * ---------------------------------------------------------------
     * Queue Connection
     * ---------------------------------------------------------------
     */
    'connections' => [
        'sync' => [
            'driver' => 'sync',
        ],

        'database' => [
            'driver' => 'database',
            'table' => 'queue',
            'retry_after' => 90,
        ],

        'api' => [
            'driver' => 'api',
            'resource' => 'http://vatgia-framework.dev/api/queue',
            'auth' => [
                'username' => 'dev',
                'password' => '113',
            ],
        ],

        'redis' => [
            'driver' => 'redis',
            'auth' => [
                'host' => '127.0.0.1',
                'port' => 6379
            ],
        ],
    ],

    /*
     * ---------------------------------------------------------------
     * Failed Queue
     * ---------------------------------------------------------------
     *
     */
    'failed' => [
        'table' => 'failed_queue',
    ],


];