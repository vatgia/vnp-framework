<?php
/**
 * Created by ntdinh1987.
 * User: ntdinh1987
 * Date: 12/3/16
 * Time: 1:14 AM
 */

return [
    'host' => env('DATABASE_HOST', 'localhost'),
    'database' => env('DATABASE_NAME', 'database_name'),
    'username' => env('DATABASE_USERNAME', 'root'),
    'password' => env('DATABASE_PASSWORD', 'root'),
    'slave' => [
        'host' => env('DATABASE_SLAVE_HOST', env('DATABASE_HOST', 'localhost')),
        'database' => env('DATABASE_SLAVE_NAME', env('DATABASE_NAME', 'database_name')),
        'username' => env('DATABASE_SLAVE_USERNAME', env('DATABASE_USERNAME', 'root')),
        'password' => env('DATABASE_SLAVE_PASSWORD', env('DATABASE_PASSWORD', 'root')),
    ],
    'max_time_slow' => 0.01,

    'timezone' => '+07:00',

    /*
     Sử dụng khi hệ thống muốn connect vào nhiều database khác nhau.
     Và muốn chỉ định rõ là connect vào server nào

     Model::useConnection('slaves') -> Connect random vào 1 server slaves
     Model::useConnection('slaves.web31') -> Connect và server web31 trong nhóm slaves
     Model::useSlave('web31') -> Connect và server web31 trong nhóm slaves

    */
    'connections' => [
        'master' => [
            [
                'host' => env('DATABASE_HOST', 'localhost'),
                'database' => env('DATABASE_NAME', 'database_name'),
                'username' => env('DATABASE_USERNAME', 'root'),
                'password' => env('DATABASE_PASSWORD', 'root'),
            ],
        ],
        'slaves' => [
            'web31' => [
                'host' => env('DATABASE_SLAVE31_HOST', 'localhost'),
                'database' => env('DATABASE_SLAVE31_NAME', 'database_name'),
                'username' => env('DATABASE_SLAVE31_USERNAME', 'root'),
                'password' => env('DATABASE_SLAVE31_PASSWORD', ''),
                'weight' => 10,
            ],
            'web32' => [
                'host' => env('DATABASE_SLAVE32_HOST', 'localhost'),
                'database' => env('DATABASE_SLAVE32_NAME', 'database_name'),
                'username' => env('DATABASE_SLAVE32_USERNAME', 'localhost'),
                'password' => env('DATABASE_SLAVE32_PASSWORD', 'root'),
            ],
        ],
        'chat' => [
            [
                'host' => env('DATABASE_CHAT_HOST', 'localhost'),
                'database' => env('DATABASE_CHAT_NAME', 'database_name'),
                'username' => env('DATABASE_CHAT_USERNAME', 'localhost'),
                'password' => env('DATABASE_CHAT_PASSWORD', 'root'),
            ],
        ],
    ],
];