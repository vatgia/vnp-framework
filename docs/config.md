# Config

### Tạo file config

Tất cả file config cần phải đươc tạo trong folder `config` theo cấu trúc sau:

    // config/database.php
    return [
      'host' => env('DATABASE_HOST', 'localhost'),
      'database' => env('DATABASE_NAME', 'database_name'),
      'username' => env('DATABASE_USERNAME', 'root'),
      'password' => env('DATABASE_PASSWORD', 'root'),
      'slave' => [
          'host' => env('DATABASE_SLAVE_HOST', 'localhost'),
          'database' => env('DATABASE_SLAVE_NAME', 'database_name'),
          'username' => env('DATABASE_SLAVE_USERNAME', 'root'),
          'password' => env('DATABASE_SLAVE_PASSWORD', 'root'),
      ],
      'max_time_slow' => 0.01
    ];

### Sử dụng

    // Get database host
    config('database.host')

    // Get database slave host
    config('database.slave.host')