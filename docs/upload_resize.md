# Upload
## Cấu hình upload
Các thông số cấu hình cho việc upload sẽ được cấu hình tại `config/upload.php`

File sẽ được upload vào đường dẫn `public/uploads/Y-m-d` được phân mục theo năm tháng ngày để tiện cho việc backup dữ liệu.

    <?php

    return [
        // Các file được phép upload
        'extensions' => ['gif', 'jpg', 'jpeg', 'png', 'doc', 'docx', 'pdf', 'bmp', 'css', 'js', 'svg','xls','xlsx'],

        // 5MB
        'file_size'  => 5120,

        'upload_folder' => 'uploads',

        // Cấu hình url cho ảnh
        'static_url' => '/'
    ];

## Code mẫu

    if (isset($_POST['submit'])) {
      if($_FILES['image']['error'] == 0) {
          $nameImage = app('uploader')->upload('image');
      }
    }

# Resize ảnh
## Cấu hình

Mọi thông tin cấu hình được lưu tại `config/image.php`

    <?php

    return array(

        /*
        |--------------------------------------------------------------------------
        | Image Driver
        |--------------------------------------------------------------------------
        |
        | Intervention Image supports "GD Library" and "Imagick" to process images
        | internally. You may choose one of them according to your PHP
        | configuration. By default PHP's "GD Library" implementation is used.
        |
        | Supported: "gd", "imagick"
        |
        */

        'driver' => 'gd',


        // Mảng resize image
        'array_resize_image' => [
            'sm_'  => ['width' => 100, 'height' => 5000],
            'md_'  => ['width' => 200, 'height' => 5000],
            'lg_'  => ['width' => 400, 'height' => 5000],
            'xlg_' => ['width' => 600, 'height' => 5000]
        ],

        // Mảng crop image
        'array_crop_image' => [
            'sm_'  => ['width' => 100, 'height' => 80],
            'md_'  => ['width' => 200, 'height' => 160],
            'lg_'  => ['width' => 400, 'height' => 320],
            'xlg_' => ['width' => 600, 'height' => 480]
        ],

        // Mảng mặc định
        'thumbs' => [
            'sm_' => ['width' => 320, 'height' => 240],
            'md_' => ['width' => 480, 'height' => 360],
            'lg_' => ['width' => 640, 'height' => 480]
        ]
    );

## Code mẫu upload và resize luôn

    if (isset($_POST['submit'])) {
      if($_FILES['image']['error'] == 0) {
          $nameImage = app('image_uploader')->upload('image');
      }
    }

## Code mẫu resize thủ công

    $image = new Nht\Hocs\Core\Images\Image();
    $image->resize($fullPathFile, $pathUpload, $arrayResize = array())