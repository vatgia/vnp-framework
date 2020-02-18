<?php

return [

    "paths" => [
        "migrations" => "%%PHINX_CONFIG_DIR%%/migrations",
        'seeds' => '%%PHINX_CONFIG_DIR%%/seeds'
    ],

    "environments" => [
        "default_migration_table" => "migrations",
        "default_database" => "development",
        "development" => [
            "adapter" => "mysql",
            "host" => env('DATABASE_HOST'),
            "name" => env('DATABASE_NAME'),
            "user" => env('DATABASE_USERNAME'),
            "pass" => env('DATABASE_PASSWORD'),
            "port" => env('DATABASE_PORT', 3306),
            "charset" => "utf8"
        ]
    ],

    'version_order' => 'creation'
];
