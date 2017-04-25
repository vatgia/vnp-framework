<?php
/**
 * Created by ntdinh1987.
 * User: ntdinh1987
 * Date: 12/2/16
 * Time: 11:20 PM
 */

return [
    // Biến môi trường
    'env' => env('APP_ENV', 'development'),

    // Chế độ dev: local hoặc api
    'mode' => (env('APP_ENV', 'production') !== 'production') ? env('APP_MODE') : 'local',

    // Đường dẫn lấy dữ liệu qua api
    'api_url_api' => env('APP_API_URL'),

    // Bật chế độ debug. Riêng app envi là production thì debug luôn = false
    'debug' => (bool)env('APP_DEBUG') && (env('APP_ENV', 'production') !== 'production'),

    // Show màn hình lỗi trong chế độ debug hay ko
    'prety_exception' => env('APP_ENV', 'production') !== 'production',
//    'prety_exception' => true,

    //Thư mục app
    'app_dir' => 'app',

    'app_uri' => env('APP_URL')
];